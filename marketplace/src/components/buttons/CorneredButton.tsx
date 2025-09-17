import style from "./CorneredButton.module.css";

interface CorneredButtonProps {
  text?: string;
  align?: "start" | "center" | "end" | "space-between" | "space-around" | "space-evenly";
}

const CorneredButton: React.FC<CorneredButtonProps> = ({
  text = "Text",
  align = "center",
}) => {
  return (
    <div className={style.buttonBlock} style={{ justifyContent: align }}>
      <a className={style.button}>{text}</a>
    </div>
  );
};

export default CorneredButton;
