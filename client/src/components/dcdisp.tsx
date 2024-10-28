import { DataColumn } from "./App";
import styles from "../css/index.module.css";

export const DataColumnDisplay = ({ data_column_obj, swapToX, toggleActiveness }: { data_column_obj: DataColumn, swapToX?: (dataColumn: DataColumn) => void, toggleActiveness?: (dataColumn: DataColumn) => void }) => {
  return (
    <div className={`${styles["flex"]} ${styles["w-full"]} ${styles["h-6"]} ${styles["gap-2"]}`}>
      {
        swapToX && toggleActiveness
          ? (
            <button className={`${styles["text-yellow-500"]} ${styles["cursor-pointer"]}`} onClick={() => {
              swapToX(data_column_obj);
            }}>★</button>
          ) : null
      }
      <button className={`${styles["flex-grow"]} ${styles["cursor-pointer"]} ${styles["text-left"]} ${data_column_obj.active ? `` : `${styles["line-through"]} ${styles["text-gray-500"]}`}`} onClick={() => { if (!toggleActiveness) return; toggleActiveness(data_column_obj); }}>{ data_column_obj.display_name }</button>
    </div>
  );
};
