import { Col, Row } from "antd";
import React from "react";

import { ReviewTaskStates } from "../../machine/enums";
import KanbanCol from "./KanbanCol";

const KanbanView = () => {
    // Don't show unassigned column because we don't save tasks in this state
    const states = Object.keys(ReviewTaskStates).filter(
        (state) => state !== ReviewTaskStates.unassigned
    );

    return (
        <Row justify="center" style={{ padding: "3vh 0", height: "100%" }}>
            <Col
                span={23}
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "nowrap",
                    overflowX: "auto",
                    gap: 12,
                }}
            >
                {states.map((state) => {
                    return (
                        <KanbanCol
                            key={state}
                            state={ReviewTaskStates[state]}
                        />
                    );
                })}
            </Col>
        </Row>
    );
};

export default KanbanView;