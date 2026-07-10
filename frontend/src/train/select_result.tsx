import { Button, Col } from "react-bootstrap";
import { ITrainingSelectResult } from "../interfaces/training.interfaces";
import { Table, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { DescriptionsToTokens } from "../../wailsjs/go/main/App";
import { TrainingMode } from "../constants/mode";
import TextToToken from "./text_to_token";
import Completed from "./completed";

function SelectResult(props: ITrainingSelectResult) {
    const [mode, setMode] = useState<number>(TrainingMode.MODE_SELECT_RESULTS)
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [texts, setTexts] = useState<string[]>([])
    const [countProcessedText, setCountProcessedText] = useState<number>(0)

    const isAllSelected = props.results.length > 0 && selectedIds.length === props.results.length;

    const handleRowSelect = (id: number) => {
        setSelectedIds((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((rowId) => rowId !== id) // Uncheck
                : [...prevSelected, id] // Check
        );
    };

    const handleSelectAll = (e: any) => {
        if (e.target.checked) {
            const allIds = props.results.map((item) => (item.index - 1));

            setSelectedIds(allIds);
        } else {
            setSelectedIds([]);

            setTexts([])
        }
    };

    function Proceed() {
        setTexts([])

        selectedIds.forEach(element => {
            setTexts((prevItems) => [...prevItems, props.results[element].text])
        })
    }

    useEffect(() => {
        if (texts.length > 0 && texts.length == selectedIds.length) {
            DescriptionToToken()
        }
    }, [texts])

    async function DescriptionToToken() {
        if (texts.length == selectedIds.length) {
            setMode(TrainingMode.MODE_PROCESSING_TEXTS_TO_TOKENS)

            for (const item of texts) {
                await DescriptionsToTokens(item).then((value) => {
                    setCountProcessedText(countProcessedText + 1)
                })
            }
            
            setMode(TrainingMode.MODE_FINISHED)
        }
    }

    function renderTableContent() {
        return props.results.map((item) => {
            return  (
                <tr>
                    <td>
                        <Form.Check
                        type="checkbox"
                        checked={selectedIds.includes(item.index - 1)}
                        onChange={() => handleRowSelect(item.index - 1)}
                        />
                    </td>
                    <td>
                        <div className="text-truncate" style={{ maxWidth: 'calc(95vw - 30px)'}}>
                            {item.text}
                        </div>
                    </td>
                </tr>
            )
        })
    }

    function renderContent() {
        switch(mode) {
            case TrainingMode.MODE_SELECT_RESULTS:
                return (
                    <>
                        <Button variant="dark" onClick={props.goBack}>Go Back</Button>
                        <Table bordered className="w-100 mt-3">
                            <thead>
                                <tr>
                                    <th>
                                        <Form.Check
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={isAllSelected}
                                        />
                                    </th>
                                    <th>Text Analysis</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    renderTableContent()
                                }
                            </tbody>
                        </Table>
                        <Button variant="success" disabled={selectedIds.length == 0} onClick={() => Proceed()}>Proceed</Button>
                    </>
                )
            case TrainingMode.MODE_PROCESSING_TEXTS_TO_TOKENS:
                return (<TextToToken countProcessedTexts={countProcessedText} totalTexts={selectedIds.length} />)
            case TrainingMode.MODE_FINISHED:
                return (<Completed />)
        }
    }

    return (
        <>
            <Col className="col-12">
                {renderContent()}
            </Col>
        </>
    )
}

export default SelectResult