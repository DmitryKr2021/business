import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, Button } from "react-bootstrap";
import { useAuth } from "./contexts/index";
import "../App.css";

class Report {
  constructor(date, manager, point, sum) {
    this.date = date;
    this.manager = manager;
    this.point = point;
    this.sum = sum;
  }
}

const Manager = () => {
  const [revenue, setRevenue] = useState("");
  const [newReport, setNewReport] = useState(true);
  const [oldReport, setOldReport] = useState({});
  const { t } = useTranslation();
  const auth = useAuth();
  const handleChange = (e) => {
    if (/^\d*$/.test(e.target.value)) {
      setRevenue(e.target.value);
    }
  };

  const hideForm = () => {
    const divForm = document.getElementById("div-form");
    divForm.classList.add("hidden");
    setNewReport(true);
  };

  const createNewReport = () => {
    const divForm = document.getElementById("div-form");
    const points = document.getElementById("point");
    const revenues = document.getElementById("revenue");
    const save = document.getElementById("save");
    divForm.classList.remove("hidden");
    setNewReport(true);
    setRevenue("");
    points.disabled = false;
    points.value = t("manager.chooseAddress");
    revenues.disabled = false;
    save.disabled = false;
  };

  const now = new Date();
  const d = now.getDate().toString().padStart(2, "0");
  const m = (now.getMonth() + 1).toString().padStart(2, "0");
  const nowDate = `${d}.${m}.${now.getFullYear()}`;
  const optionsWrite = {
    suggestedName: `${t(`manager.${auth.user.password}`)} ${newReport ? nowDate : oldReport.date}`,
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

  const saveReport = async (e) => {
    e.preventDefault();
    const formData = new FormData(document.getElementById("form"));
    const saveDate = newReport ? nowDate : oldReport.date;
    const report = new Report(
      saveDate,
      t(`manager.${auth.user.password}`),
      formData.get("point"),
      formData.get("revenue"),
    );
    const fileData = JSON.stringify(report);

    try {
      const fileHandle = await window.showSaveFilePicker(optionsWrite);
      const writableStream = await fileHandle.createWritable();
      await writableStream.write(fileData);
      await writableStream.close();
    } catch (err) {
      if (err.name === "AbortError") {
        console.error(err.name, err.message);
      }
    }
    hideForm();
  };

  const chooseReport = async () => {
    const divForm = document.getElementById("div-form");
    const points = document.getElementById("point");
    const revenues = document.getElementById("revenue");
    const save = document.getElementById("save");
    try {
      const [fileHandle] = await window.showOpenFilePicker(optionsRead);
      const file = await fileHandle.getFile();
      const fileContent = await file.text();
      divForm.classList.remove("hidden");
      const old = JSON.parse(fileContent);
      const { date, point, sum, manager } = old;
      setOldReport({
        point,
        date,
        sum,
        manager,
      });
      setRevenue(sum);
      setNewReport(false);
      const oldMonth = +date.slice(3, 5);
      const nowMonth = +nowDate.slice(3, 5);
      points.value = point;
      if (
        t(`manager.${auth.user.password}`) !== manager ||
        oldMonth < nowMonth
      ) {
        points.setAttribute("disabled", "disabled");
        revenues.setAttribute("disabled", "disabled");
        save.setAttribute("disabled", "disabled");
      } else {
        points.disabled = false;
        revenues.disabled = false;
        save.disabled = false;
      }
    } catch (err) {
      if (err.name === "AbortError") {
        console.error(err.name, err.message);
      }
    }
  };

  return (
    <>
      <div className="container shadow p-3 mb-5 bg-body-tertiary rounded mt-2 fs-3 d-flex justify-content-around">
        <div className="header">
          {t("manager.manager")}
          <span>&nbsp;{t(`manager.${auth.user.password}`)}</span>
        </div>
        <div className="w-50 d-flex justify-content-around">
          <Button
            className="report btn btn-secondary"
            onClick={createNewReport}
          >
            {t("manager.newReport")}
          </Button>
          <Button className="report btn btn-secondary" onClick={chooseReport}>
            {t("manager.seeReport")}
          </Button>
        </div>
      </div>
      <div
        className="container shadow p-3 mb-5 bg-body-tertiary rounded mt-2 fs-3 d-flex justify-content-around hidden"
        id="div-form"
      >
        <Form onSubmit={saveReport} id="form" className="w-25">
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="date"
              id="date"
              disabled
              value={newReport ? nowDate : oldReport.date}
            />
            <Form.Label>{t("manager.manager")}</Form.Label>
            <Form.Control
              type="text"
              value={
                newReport
                  ? t(`manager.${auth.user.password}`)
                  : oldReport.manager
              }
              id="manager"
              disabled
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("manager.address")}</Form.Label>
            <Form.Select aria-label="Default select" name="point" id="point">
              <option>{t("manager.chooseAddress")}</option>
              <option>{t("manager.address1")}</option>
              <option>{t("manager.address2")}</option>
              <option>{t("manager.address3")}</option>
              <option>{t("manager.address4")}</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("manager.revenue")}</Form.Label>
            <Form.Control
              type="text"
              value={revenue}
              name="revenue"
              id="revenue"
              onChange={handleChange}
            />
          </Form.Group>
          <div className="d-flex justify-content-between">
            <Button
              className="btn1 d-inline-block"
              variant="secondary"
              type="submit"
              id="save"
            >
              {t("manager.save")}
            </Button>
            <Button
              className="btn1 d-inline-block"
              variant="secondary"
              onClick={hideForm}
            >
              {t("manager.cancel")}
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Manager;
/*
value={newReport ? revenue : oldReport.sum}
  {newReport ? t("manager.chooseAddress") : oldReport.point}
*/
