import cn from "classnames";
import style from "./CorneredButton.module.css";

interface CorneredButtonProps {
  text?: string;
  className?: string;
  align?: "start" | "center" | "end" | "space-between" | "space-around" | "space-evenly";
}

const CorneredButton: React.FC<CorneredButtonProps> = ({
  text = "Text",
  align = "center",
  className = ""
}) => {
  return (
    <div className={cn(style.buttonBlock, className)} style={{ justifyContent: align }}>
      <a className={style.button}>{text}</a>
    </div>
  );
};

export default CorneredButton;
