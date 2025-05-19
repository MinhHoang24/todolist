import CheckIcon from '@atlaskit/icon/glyph/check'
import TrashIcon from "@atlaskit/icon/glyph/trash"; // hoặc bất kỳ icon nào bạn dùng

export default function Todo({ todo, onCheckBtnClick, onDeleteBtnClick }) {
  return (
    <div className={`todo-item ${todo.isCompleted ? 'completed' : ''}`}>
      <span>{todo.name}</span>
      <div style={{ display: "flex", gap: "8px" }}>
        {!todo.isCompleted ? (
          <span className="check-icon" onClick={() => onCheckBtnClick(todo.id)}>
            <CheckIcon primaryColor="#4fff4f" />
          </span>
        ) : (
          <span className="check-icon" onClick={() => onDeleteBtnClick(todo.id)}>
            <TrashIcon primaryColor="#ff4f4f" />
          </span>
        )}
      </div>
    </div>
  );
}