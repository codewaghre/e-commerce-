import {
  FaArrowLeftLong,
  FaArrowRightLong,
} from "react-icons/fa6";

function PrevButton() {
  const handleClick = () => {
    console.log("Previous button clicked");
  };

  return (
    <button onClick={handleClick} className="carousel-btn">
      <FaArrowRightLong />
    </button>
  );
}

function NextButton() {
  const handleClick = () => {
    console.log("Next button clicked");
  };

  return (
    <button onClick={handleClick} className="carousel-btn">
      <FaArrowLeftLong />
    </button>
  );
}

export { NextButton, PrevButton };
