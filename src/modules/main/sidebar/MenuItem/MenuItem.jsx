import React, { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import "./menu.css";
import { AiOutlineCaretLeft, AiOutlineCaretRight } from "react-icons/ai";
// import { mapIconToComponent } from "../../utils/Icons";

// const IconComponentLoader = ({ iconName }) => {
//   const IconComponent = mapIconToComponent(iconName);
//   return <IconComponent />;
// };

const MenuItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const [isMainActive, setIsMainActive] = useState(false);
  const [isOneOfChildrenActive, setIsOneOfChildrenActive] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const calculateIsActive = () => {
    setIsMainActive(false);
    setIsOneOfChildrenActive(false);
    if (item.child) {
      item.child.forEach((m) => {
        if (location.pathname.match(m.path)) {
          setIsOneOfChildrenActive(true);
        }
      });
    }
    if (item.path == location.pathname) {
      setIsMainActive(true);
    }
  };

  const handleClick = (path) => {
    navigate(path);
    setExpanded(false);
  };

  const handleMenuClick = () => {
    if (item.path) {
      navigate(item.path);
    } else {
      setExpanded(!expanded);
    }
  };

  useEffect(() => {
    calculateIsActive();
  }, [location, item, expanded]);

  return (
    <li style={{ marginBottom: "10px" }}>
      <div
        className={`custom-nav-item ${isMainActive || isOneOfChildrenActive ? "active" : ""
          }`}
        onClick={() => {
          handleMenuClick();
        }}>
        <div className='d-flex align-items-center'>
          <span className='nav-icons'>{item.icon}</span>
          <span className='nav-title'>{item.name}</span>
        </div>
        {item.child && item.child.length > 0 && (
          <span>
            <FaChevronDown className={`arrow ${expanded ? "open" : ""}`} />
          </span>
        )}
      </div>
      {!!expanded && item.child && !!item.child.length > 0 && (
        <div className={`custom-child-nav ${expanded ? "expanded" : ""}`}>
          <ul className='child-nav-lists mt-1'>
            {item.child.map((ch) => (
              <li
                key={ch.id}
                className={`child-nav-items d-flex gap-2 align-items-center ${location.pathname === ch.path ? "active" : ""
                  }`}
                onClick={() => {
                  handleClick(ch.path);
                }}>
                <AiOutlineCaretRight />
                {ch.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

export default MenuItem;
