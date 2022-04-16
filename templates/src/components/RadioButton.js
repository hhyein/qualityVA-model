import React from "react"

// id 필수
export default function RadioButton({ id, checked, onClick }) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <input id={id} type="radio" style={{ display: "none" }} />
      <label
        htmlFor={id}
        style={{
          display: "block",
          width: "16px",
          height: "16px",
          marginRight: "5px",
          boxSizing: "border-box",
          borderRadius: "50%",
          border: "3px solid white",
          boxShadow: "0 0 0 1px rgb(204, 204, 204)",
          backgroundColor: checked ? "rgb(204, 204, 204)" : "white",
        }}
        onClick={() => onClick(id)}
      />
      <label htmlFor={id} onClick={() => onClick(id)}>
        {id}
      </label>
    </div>
  )
}
