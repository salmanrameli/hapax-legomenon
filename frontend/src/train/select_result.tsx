import { Button, Col } from "react-bootstrap";
import { ITrainingSelectResult } from "../interfaces/training.interfaces";
import { Table, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { DescriptionsToTokens } from "../../wailsjs/go/main/App";

function SelectResult(props: ITrainingSelectResult) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [texts, setTexts] = useState<string[]>([])

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
        const combinedTexts = texts.join(";")

        if (combinedTexts != "") {
            DescriptionsToTokens(combinedTexts).then((value) => {
                
            })
        }
    }

    function renderTableContent() {
        return props.results.map((item) => {
            return  <tr>
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
        })
    }

    return (
        <>
            <Col className="col-12">
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
            </Col>
        </>
    )
}

export default SelectResult