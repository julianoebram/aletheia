import { Button, ButtonProps, Tooltip } from "antd";
import React from "react";
import colors from "../../styles/colors";

interface FabProps extends Omit<ButtonProps, "shape" | "type" | "size"> {
    tooltipText: string;
    icon: React.ReactNode;
    size: number | string;
}

const Fab = ({ tooltipText, style, icon, size, ...rest }: FabProps) => {
    return (
        <Tooltip placement="left" title={tooltipText}>
            <Button
                style={{
                    background: colors.white,
                    color: colors.bluePrimary,
                    boxShadow: "rgba(0, 0, 0, 0.35) 0px 8px 24px",
                    display: "grid",
                    placeContent: "center",
                    width: size,
                    height: size,
                    ...style,
                }}
                shape="circle"
                type="link"
                icon={icon}
                {...rest}
            />
        </Tooltip>
    );
};

export default Fab;