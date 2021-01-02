import React, { useRef, useState } from "react";
import { Modal } from "antd";
import readXlsxFile from "read-excel-file";

const schema = {
  name: {
    prop: "name",
    type: String,
    // Excel stores dates as integers.
    // E.g. '24/03/2018' === 43183.
    // Such dates are parsed to UTC+0 timezone with time 12:00 .
  },
  mrp: {
    prop: "mrp",
    type: Number,
    // Excel stores dates as integers.
    // E.g. '24/03/2018' === 43183.
    // Such dates are parsed to UTC+0 timezone with time 12:00 .
  },
  offer: {
    prop: "offer",
    type: Number,
    // Excel stores dates as integers.
    // E.g. '24/03/2018' === 43183.
    // Such dates are parsed to UTC+0 timezone with time 12:00 .
  },
};

const ExcelUploadWithValidation = () => {
  const [isVisble, setVisible] = useState(false);
  const [excelErr, setExcelErr] = useState([]);
  const inputRef = useRef();
  const handleChange = (e) => {
    readXlsxFile(e.target.files[0], { schema }).then((rows, err) => {
      console.log(rows, err);
      if (rows.errors.length > 0) {
        setVisible(true);
        setExcelErr(rows.errors);
      }
    });
  };

  const handleClose = () => {
    setVisible(false);
    inputRef.current.value = ''
  };

  return (
    <>
      <input type="file" ref={inputRef} onChange={handleChange} />
      <Modal
        title="Basic Modal"
        visible={isVisble}
        onOk={handleClose}
        onCancel={handleClose}
      >
        {excelErr.map((list) => (
          <p>
            In row {list.row} {list.column} column data is invalid value{" "}
            {list.value}
          </p>
        ))}
      </Modal>
    </>
  );
};

export default ExcelUploadWithValidation;
