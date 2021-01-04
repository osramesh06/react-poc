import React, { useRef, useState } from "react";
import { Modal, notification } from "antd";
import readXlsxFile from "read-excel-file";

const schema = {
  name: {
    prop: "name",
    type: String,
    required: true,
    title: "Name",
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
    new Promise((resolve) => {
      readXlsxFile(e.target.files[0]).then((res) => {
        if (res.length > 0) {
          let headingsColumn = res[0];
          let missedColumn = [];
          for (let [key] of Object.entries(schema)) {
            if (headingsColumn.includes(key) === false) {
              missedColumn.push(key);
            }
          }
          if (missedColumn.length > 0) {
            notification.error({
              message: "Column are Missed",
              description: `${missedColumn.toString()} this column are missed in this excel file upload correct excel file`,
            });
          } else {
            resolve();
          }
        }
      });
    }).then(() => {
      readXlsxFile(e.target.files[0], { schema }).then((rows, err) => {
        if (rows.errors.length > 0) {
          setVisible(true);
          setExcelErr(rows.errors);
        }
      });
    });
  };

  const handleClose = () => {
    setVisible(false);
    inputRef.current.value = "";
  };

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        accept=".xlsx, .xls"
      />
      <Modal
        title="Mismatched values rows"
        visible={isVisble}
        onOk={handleClose}
        onCancel={handleClose}
      >
        {excelErr.map((list, i) => (
          <p key={i}>
            In row {list.row} {list.column} column data is invalid value{" "}
            {list.value}
          </p>
        ))}
      </Modal>
    </>
  );
};

export default ExcelUploadWithValidation;
