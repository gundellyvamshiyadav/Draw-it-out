/* eslint-disable react/prop-types */
import { PiPencilSimpleFill } from "react-icons/pi";
import { FaChevronDown } from "react-icons/fa";
import { FaFeatherPointed } from "react-icons/fa6";
import { RiScreenshot2Fill } from "react-icons/ri";
import { FaFilePdf } from "react-icons/fa";
import { TbFileTypeSvg } from "react-icons/tb";
import TextEditor from './TextEditor';
import React, { useState,useEffect } from 'react';


import {
  convertToPDF,
  convertToSVG,
  convertToJPG,
  convertToPng,
} from "../utils/canvas.js";
import { PiPlus } from "react-icons/pi";
import { PiMinus } from "react-icons/pi";
import { increaseHeight } from "../utils/canvas.js";
import { decreaseHeight } from "../utils/canvas.js";
import DrawingShapes from "./DrawingShapes.jsx";
// import BgColor from "./BgColor.jsx";

const Menu = ({
  thickness,
  setThickness,
  color,
  setColor,
  canvasRef,
  setBrushStyle,
  bgColor,
  brushStyle,
  selectedTool,
  setSelectedTool,
}) => {
  const [pencilWidth, setPencilWidth] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [fillColor, setFillColor] = useState(false);
  const [textObjects, setTextObjects] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  const handleBrushStyleChange = (style) => {
    setBrushStyle(style);
    setIsDropdownOpen(false); // Close the dropdown after selecting a style
  };
  
  const handleAddText = ({ text, fontSize, fontFamily }) => {
    const newTextObject = { text, fontSize, fontFamily, x: 300, y: 400 };
    setTextObjects([...textObjects, newTextObject]);
  };

  const handleClearText = () => {
    setTextObjects([]);
  };

  const handleMouseDown = (e, index) => {
    e.preventDefault();
    setIsDragging(true);
    setDraggedIndex(index);
    setStartX(e.clientX);
    setStartY(e.clientY);
    setOffsetX(textObjects[index].x - e.clientX);
    setOffsetY(textObjects[index].y - e.clientY);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || draggedIndex === null) return;
    const updatedTextObjects = [...textObjects];
    updatedTextObjects[draggedIndex].x = e.clientX + offsetX;
    updatedTextObjects[draggedIndex].y = e.clientY + offsetY;
    setTextObjects(updatedTextObjects);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedIndex(null);
  };
  
  useEffect(() => {
    if (!isDragging) return;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <>
      <div className="max-w-[90%] flex-wrap	 tools bg-[#CBCCCF] shadow-mdm dark:bg-[#111111] shadow-black flex justify-center   items-center gap-[1rem] md:gap-[3rem] px-[2rem] pt-6 pb-10 rounded-[0.6rem]  ">
        <div className="relative ">
          <PiPencilSimpleFill
            className={`text-[2rem] md:text-[3rem] p-[0.5rem] md:p-[0.8rem] shadow-vsm rounded-[0.5rem] cursor-pointer text-black bg-[#CBCCCF] hover:bg-[#B7BABF] ${
              isDropdownOpen ? "bg-gray-400" : ""
            }`}
            onClick={toggleDropdown}
            title="Draw"
          />
          <div
            className={`absolute top-full bg-[#CBCCCF] shadow-black  mx-auto rounded-[0.5rem] left-1/2 transform -translate-x-1/2  shadow-md ${
              isDropdownOpen ? "block" : "hidden"
            }`}
          >
            {/* Dropdown content */}
            <div className="py-2 bg-[#CBCCCF] ">
              <button
                className={`block px-4 py-2 text-left hover:bg-gray-200 w-full ${
                  brushStyle === "solid" ? "font-bold" : ""
                }`}
                onClick={() => {
                  setBrushStyle("solid");
                  setIsDropdownOpen(!isDropdownOpen);
                }}
              >
                Solid
              </button>
              <button
                className={`block px-4 py-2 text-left hover:bg-gray-200 w-full ${
                  brushStyle === "dotted" ? "font-bold" : ""
                }`}
                onClick={() => {
                  setBrushStyle("dotted");
                  setIsDropdownOpen(!isDropdownOpen);
                }}
              >
                Dotted
              </button>
              <button
                className={`block px-4 py-2 text-left hover:bg-gray-200 w-full ${
                  brushStyle === "dashed" ? "font-bold" : ""
                }`}
                onClick={() => {
                  setBrushStyle("dashed");
                  setIsDropdownOpen(!isDropdownOpen);
                }}
              >
                Dashed
              </button>
              <button
                className={`block px-4 py-2 text-left hover:bg-gray-200 w-full ${
                  brushStyle === "faded" ? "font-bold" : ""
                }`}
                onClick={() => {
                  setBrushStyle("faded");
                  setIsDropdownOpen(!isDropdownOpen);
                }}
              >
                Faded
              </button>
            </div>
          </div>
          {/* Arrow */}
          <FaChevronDown
            className={`absolute top-full left-1/2 transform -translate-x-1/2 text-gray-600 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </div>
        <DrawingShapes
          brushWidth={thickness}
          selectedColor={color}
          fillColor={fillColor}
          canvasRef={canvasRef}
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
        />
        <button>
          <input
            type="checkbox"
            id="fill-color"
            onChange={(e) => setFillColor(e.target.checked)}
            title="Fill Color"
          />
          <label htmlFor="fill-color">Fill color</label>
        </button>
        <button className="relative">
          <FaFeatherPointed
            className={`text-[2rem] md:text-[3rem] p-[0.5rem] md:p-[0.8rem] shadow-black shadow-vsm mx-auto rounded-[0.5rem] text-black  bg-[#CBCCCF] cursor-pointer hover:bg-[#B7BABF]transform transition duration-300 ease-in-out ${
              pencilWidth ? "bg-gray-200" : ""
            }`}
            onClick={() => setPencilWidth(!pencilWidth)}
            title="Brush Thickness"
          />
          <span className=" absolute -left-3 top-14">Thickness</span>
        </button>

        {pencilWidth && (
          <input
            type="range"
            name="thickness"
            id="thickness"
            value={thickness || 10}
            min={1}
            max={100}
            onChange={(e) => {
              setThickness(e.target.value);
            }}
            className="cursor-pointer"
          />
        )}
        <div className="py-[1rem] px-[1.5rem] rounded-[0.5rem] w-12 h-12 relative shadow-black shadow-vsm  hover:bg-[#B7BABF] text-black text-blackcursor-pointer">
          <input
            type="color"
            name="color"
            id="color"
            title="Color Picker"
            onChange={(e) => setColor(e.target.value)}
            className={`bg-[#CBCCCF] p-[0.5rem] shadow-vsm rounded-[0.5rem] cursor-pointer outline-none hover:bg-[#B7BABF] flex-[0.5] w-full h-full z-[5] absolute top-0 left-0  transform transition duration-300 ease-in-out `}
          />
          <span className="absolute top-14 left-[0.3rem] dark:text-[#ffffff]">
            Color
          </span>
        </div>
        <div className="relative">
          <button
            id="dropdownHoverButton"
            data-dropdown-toggle="dropdownHover"
            data-dropdown-trigger="hover"
            className="text-gray-700 bg-[#B7BABF] focus:ring-4 font-medium rounded-lg text-lg px-5 py-2.5 text-center inline-flex items-center   transform transition duration-300 ease-in-out "
            type="button"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Save As
            <svg
              className="w-2.5 h-2.5 ms-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>

          <div
            id="dropdownHover"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`absolute z-10 ${
              isOpen ? "" : "hidden"
            } divide-y bg-[#CBCCCF] rounded-lg shadow w-59 top-[3.1rem]`}
          >
            <ul
              className="text-sm text-gray-700 flex space-x-5 p-5 justify-center"
              aria-labelledby="dropdownHoverButton"
            >
              <li>
                <button
                  className={`text-[1rem] md:text-[1rem] p-[0.5rem] md:p-[0.8rem] shadow-mdm rounded-[0.5rem] cursor-pointer hover:bg-[#B7BABF]`}
                  onClick={() => convertToPng(canvasRef.current)}
                  title="ToPNG"
                >
                  <p>PNG</p>
                </button>
              </li>

              <li>
                <button
                  className={`text-[1rem] md:text-[1rem] p-[0.5rem] md:p-[0.8rem] shadow-mdm rounded-[0.5rem] cursor-pointer hover:bg-[#B7BABF]`}
                  onClick={() => convertToJPG(canvasRef.current)}
                  title="ToJPG"
                >
                  <p>JPG</p>
                </button>
              </li>
              <li>
                <FaFilePdf
                  className={`text-[2rem] md:text-[3rem] p-[0.5rem] md:p-[0.8rem] shadow-mdm rounded-[0.5rem] cursor-pointer hover:bg-[#B7BABF]`}
                  onClick={() => convertToPDF(canvasRef.current)}
                  title="PDF"
                />
              </li>
              <li>
                <TbFileTypeSvg
                  className={`text-[2rem] md:text-[3rem] p-[0.5rem] md:p-[0.8rem] shadow-mdm rounded-[0.5rem] cursor-pointer hover:bg-[#B7BABF]  `}
                  onClick={() => convertToSVG(canvasRef.current)}
                  title="SVG"
                />
              </li>
            </ul>
          </div>
        </div>
        <button>
          <PiPlus
            className={`text-[2rem] md:text-[3rem] p-[0.5rem] md:p-[0.8rem] shadow-vsm rounded-[0.5rem] text-black cursor-pointer bg-[#CBCCCF] hover:bg-[#B7BABF]  transform transition duration-300 ease-in-out `}
            onClick={() =>
              increaseHeight(
                canvasRef.current,
                bgColor,
                thickness,
                color,
                brushStyle
              )
            }
            title="IncreaseHeight"
          />
        </button>
        <button>
          <PiMinus
            className={`text-[2rem] md:text-[3rem] p-[0.5rem] md:p-[0.8rem] shadow-vsm rounded-[0.5rem] text-black cursor-pointer bg-[#CBCCCF] hover:bg-[#B7BABF]  transform transition duration-300 ease-in-out `}
            onClick={() =>
              decreaseHeight(
                canvasRef.current,
                bgColor,
                thickness,
                color,
                brushStyle
              )
            }
            title="DecreaseHeight"
          />
        </button>
        <div className="text-editor">
          {/* TextEditor component for entering text */}
          <TextEditor addText={handleAddText} clearText={handleClearText}/>
          <button onClick={handleClearText} className="mt-2 bg-red-500 text-white rounded-md hover:bg-red-400" title="Clear text">Clear All Text</button>
      </div>
      <div>
        {textObjects.map((textObj, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              top: textObj.y,
              left: textObj.x,
              fontSize: textObj.fontSize,
              fontFamily: textObj.fontFamily,
              cursor: "move",
              userSelect: "none",
            }}
            onMouseDown={(e) => handleMouseDown(e, index)}
          >
            {textObj.text}
          </div>
        ))}
        </div>
        
      </div>
    </>
  );
};

export default Menu;
