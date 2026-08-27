import { useNavigate } from "react-router-dom"


export default function BackBtn() {

  const navigate = useNavigate()

  return (
    <>
    <button
      className="cybrez-button cybrez-button-ghost"
      onClick={() => navigate(-1)}
    >
        Back
    </button></>
)
}