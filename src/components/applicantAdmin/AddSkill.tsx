import  { useState } from "react";

function Add_skill() {
  const [modal, setModal] = useState(false);

  const addPassingYearOpen = () => {
    setModal(true);
  };

  const addPassingYearClose = () => {
    setModal(false);
  };


  return (
    <>
      <form className="frm-container">
        <div className="container">
          <div className="firstDiv">
            <div className="div-addyear">
              <div className="txt-pasy">Add DropDown Items of Skill</div>
              <button
                type="button"
                className="btnAdd-year"
                onClick={addPassingYearOpen}
              >
                <i className="fa-solid fa-plus"></i> Add
              </button>
            </div>
            <br />
            {modal && (
              <div onClick={addPassingYearClose}>
                <div className="overlay"></div>
                <div className="modal">
                  <div className="modal-content">
                    <div className="close">
                      <button
                        type="button"
                        className="btn-close"
                        onClick={addPassingYearClose}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                    <div className="div-psy">
                      <label>Skill Name</label>
                      <br />
                      <input
                        type="text"
                        placeholder="Python"
                        className="inp-pasy"
                      ></input>
                      <div className="separator"></div>
                      <div>
                        <button
                          type="button"
                          className="btn-cancle"
                          onClick={addPassingYearClose}
                        >
                          Cancle
                        </button>
                        <button
                          type="button"
                          className="btn-Add"
                          onClick={addPassingYearClose}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="div-two">
            <div>
              <div className="txt-pasydiv2">Skills</div>
              <div className="search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  type="text"
                  placeholder="Quick search"
                  className="quick-search"
                ></input>
              </div>
            </div>
            <div className="tbl-div">
              <table className="tbl-container custom-table">
                <thead className="thead-cls">
                  <tr>
                    <td>Sr.no</td>
                    <td>Skill</td>
                    <td>Action</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>React JS</td>
                    <td>
                      <button className="btn-delete">Delete</button>
                    </td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>Node JS</td>
                    <td>
                      <button className="btn-delete">Delete</button>
                    </td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>Python</td>
                    <td>
                      <button className="btn-delete">Delete</button>
                    </td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>Vue JS</td>
                    <td>
                      <button className="btn-delete">Delete</button>
                    </td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>C++</td>
                    <td>
                      <button className="btn-delete">Delete</button>
                    </td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>C#</td>
                    <td>
                      <button className="btn-delete">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="div-tlt">
            <label className="lbl-tlt">Totals</label>
            <input
              type="text"
              placeholder="Number of Field"
              className="inp-tlt"
            ></input>
          </div>
        </div>
      </form>
    </>
  );
}

export default Add_skill;