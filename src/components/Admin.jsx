import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, Button } from "react-bootstrap";
import "../App.css";
import consolidData from "./consolidate.json";

const Admin = () => {
  const [oldReport, setOldReport] = useState({});
  const [revenue, setRevenue] = useState("");
  const { t } = useTranslation();
  const now = new Date();
  const year = now.getFullYear();
  const nowMonth = (now.getMonth() + 1).toString().padStart(2, "0");
  const [month, setMonth] = useState(`${year}-${nowMonth}`);

  const hideForm = () => {
    const divForm = document.getElementById("div-form1");
    divForm.classList?.add("hidden");
  };

  const hideConsolidate = () => {
    const consolidate = document.getElementById("consolidate");
    consolidate.classList?.add("hidden");
  };

  const optionsRead = {
    types: [
      {
        description: "JSON",
        accept: {
          "application/json": ".json",
        },
      },
    ],
    excludeAcceptAllOption: true,
  };

  const chooseReport = async () => {
    const divForm = document.getElementById("div-form1");
    try {
      const [fileHandle] = await window.showOpenFilePicker(optionsRead);
      const file = await fileHandle.getFile();
      const fileContent = await file.text();
      divForm.classList?.remove("hidden");
      const old = JSON.parse(fileContent);
      const { date, point, sum, manager } = old;
      setOldReport({
        point,
        date,
        sum,
        manager,
      });
    } catch (err) {
      if (err.name === "AbortError") {
        console.error(err.name, err.message);
      }
    }
  };

  const seeConsolidateReport = () => {
    const consolidate = document.getElementById("consolidate");
    consolidate.classList?.remove("hidden");
  };

  const handleMonth = (e) => {
    const { value } = e.target;
    setMonth(value);
    if (value in consolidData) {
      setRevenue(consolidData[value]);
    } else {
      setRevenue("");
    }
  };

  return (
    <>
      <div className="container shadow p-3 mb-5 bg-body-tertiary rounded mt-2 fs-3 d-flex justify-content-around">
        <div className="header">{t("admin.admin")}</div>
        <div className="w-50 d-flex justify-content-around">
          <Button className="report btn btn-secondary" onClick={chooseReport}>
            {t("manager.seeReport")}
          </Button>
          <Button
            className="report btn btn-secondary"
            onClick={seeConsolidateReport}
          >
            {t("admin.consolidated")}
          </Button>
        </div>
      </div>
      <div
        className="container shadow p-3 mb-5 bg-body-tertiary rounded mt-2 fs-3 d-flex justify-content-around hidden"
        id="div-form1"
      >
        <Form id="form1" className="w-25">
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="date"
              id="date1"
              disabled
              value={oldReport.date}
            />
            <Form.Label>{t("manager.manager")}</Form.Label>
            <Form.Control
              type="text"
              value={oldReport.manager}
              id="manager1"
              disabled
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("manager.address")}</Form.Label>
            <Form.Control
              type="text"
              value={oldReport.point}
              id="point1"
              disabled
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("manager.revenue")}</Form.Label>
            <Form.Control
              type="text"
              value={oldReport.sum}
              name="revenue"
              id="revenue1"
              disabled
            />
          </Form.Group>
          <div className="d-flex justify-content-between">
            <Button
              className="btn1 d-inline-block"
              variant="secondary"
              onClick={hideForm}
            >
              {t("admin.close")}
            </Button>
          </div>
        </Form>
      </div>
      <div
        className="container shadow p-3 mb-3 bg-body-tertiary rounded mt-2 fs-3 hidden"
        id="consolidate"
      >
        <Form>
          <div className="d-flex">
            <div className="mb-3 row w-50">
              <Form.Label className="col-sm-5 col-form-label">
                {t("admin.chooseMonth")}
              </Form.Label>
              <div className="col-sm-4 mt-2">
                <Form.Control
                  type="month"
                  id="start"
                  min="2018-01"
                  name="start"
                  onChange={handleMonth}
                  value={month}
                />
              </div>
            </div>
            <div className="mb-3 row w-50">
              <Form.Label className="col-sm-3 col-form-label">
                {t("admin.revenue")}
              </Form.Label>
              <div className="col-sm-3 mt-2">
                <Form.Control value={revenue} disabled />
              </div>
            </div>
          </div>
        </Form>
        <Button className="btn2" variant="secondary" onClick={hideConsolidate}>
          {t("admin.close")}
        </Button>
      </div>
    </>
  );
};

export default Admin;
