import * as React from "react";

interface OnClickLinkProps {
    children: React.ReactChild | React.ReactChild[];
    className?: string;
    onClick: () => void;
}

export function OnClickLink(props: OnClickLinkProps): React.ReactElement {
    function onClick(event: React.MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();
        props.onClick();
    }

    return (
        <a href="#" onClick={onClick} className={props.className || ""}>
            {props.children}
        </a>
    );
}