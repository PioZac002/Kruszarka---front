import React, { useEffect, useState, useRef } from 'react';
import './Diagrams.scss';
import Sidebar from '../Dashboard/SideBar Section/Sidebar';
import { endpoints } from '../../api';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

const Diagrams = () => {
  const [reportName, setReportName] = useState('');
  const [data, setData] = useState([]);
  const [integrators, setIntegrators] = useState([]);
  const [groups, setGroups] = useState([]);
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState('');
  const [role, setRole] = useState({ isManager: false, isService: false });
  const [error, setError] = useState(null);
  const [reports, setReports] = useState([]);
  const [selectedPK, setSelectedPK] = useState('');
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');
  const [reportData, setReportData] = useState([]);
  const [viewReport, setViewReport] = useState(null);
  const [validationError, setValidationError] = useState('');

  const chartRef = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    const role = JSON.parse(localStorage.getItem('role'));
    setRole(role);
    if (role.isService) {
      fetchManagers();
    } else {
      fetchIntegrators();
      fetchGroups();
    }
    fetchReports();
  }, []);

  const fetchIntegrators = async (managerID = '') => {
    try {
      const userID = localStorage.getItem('userID');
      const token = localStorage.getItem('id_token');
      let url = endpoints.getIntegrators(userID);
      if (managerID) {
        url += `?createdFor=${managerID}`;
      }
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch integrators');
      }
      const data = await response.json();
      setIntegrators(data.integrators);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchGroups = async (managerID = '') => {
    try {
      const userID = localStorage.getItem('userID');
      const token = localStorage.getItem('id_token');
      let url = endpoints.getIntegratorGroups(userID);
      if (managerID) {
        url += `?createdFor=${managerID}`;
      }
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }
      const data = await response.json();
      setGroups(data.integratorGroups);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchManagers = async () => {
    try {
      const userID = localStorage.getItem('userID');
      const token = localStorage.getItem('id_token');
      const response = await fetch(endpoints.getWorkers(userID), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch managers');
      }
      const data = await response.json();
      setManagers(data.workers.filter((worker) => worker.role.isManager));
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchReports = async () => {
    try {
      const userID = localStorage.getItem('userID');
      const token = localStorage.getItem('id_token');
      const response = await fetch(endpoints.getReports(userID), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }
      const data = await response.json();
      const reportIDsArray = data.map((item) => ({
        reportID: item.SK.substring(7),
        reportName: item.SK.split('/')[1], // Extract report name
      }));
      setReports(reportIDsArray);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchReportData = async (reportID) => {
    try {
      const userID = localStorage.getItem('userID');
      const token = localStorage.getItem('id_token');
      const response = await fetch(
        `${endpoints.getReportData(userID)}?reportID=${reportID}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }
      const data = await response.json();
      setReportData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateReport = async () => {
    try {
      const userID = localStorage.getItem('userID');
      const token = localStorage.getItem('id_token');
      const payload = {
        reportName,
        data: data.map((item) => ({
          ...item,
          PK: item.PK.split('#')[1], // Usunięcie prefiksu "integrator#" lub "group#"
        })),
      };
      const url = role.isService
        ? `${endpoints.createReport(userID)}?managerID=${selectedManager}`
        : endpoints.createReport(userID);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Failed to create report');
      }
      const reportData = await response.json();
      setReports([...reports, { reportID: payload.reportName, reportName }]);
      alert('Report created successfully');
    } catch (err) {
      setError(err.message);
      alert('Failed to create report');
    }
  };

  const handleAddData = () => {
    if (!selectedPK || !rangeStart || !rangeEnd) {
      alert('Please select all fields');
      return;
    }

    if (new Date(rangeStart) >= new Date(rangeEnd)) {
      setValidationError('Range End date must be after Range Start date');
      setTimeout(() => {
        setValidationError('');
      }, 5000);
      return;
    } else {
      setValidationError('');
    }

    setData([
      ...data,
      {
        PK: selectedPK,
        RangeStart: new Date(rangeStart).toISOString(),
        RangeEnd: new Date(rangeEnd).toISOString(),
        isGroup: selectedPK.startsWith('group'),
      },
    ]);
  };

  const handleManagerChange = (e) => {
    setSelectedManager(e.target.value);
    if (e.target.value) {
      fetchIntegrators(e.target.value);
      fetchGroups(e.target.value);
    } else {
      setIntegrators([]);
      setGroups([]);
    }
  };

  const handleViewReport = (reportID) => {
    fetchReportData(reportID);
    setViewReport(reportID);
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    doc.text('Report Data', 20, 10);
    reportData.forEach(([key, values], index) => {
      const name = key.startsWith('group')
        ? groups.find((group) => group.PK === key.split('#')[1])
            ?.integratorGroupName || key
        : integrators.find((integrator) => integrator.PK === key.split('#')[1])
            ?.serialNumber || key;
      doc.text(`Data for ${name}`, 20, 20);
      const headers = [['Name', 'Time', 'Total Crushed']];
      const rows = values.map((value) => [
        name,
        new Date(value.SK).toLocaleString(),
        value.totalCrushed,
      ]);
      doc.autoTable({
        head: headers,
        body: rows,
        startY: 30,
      });
      if (index < reportData.length - 1) {
        doc.addPage();
      }
    });

    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        reportData.forEach((_, index) => {
          doc.addPage();
          doc.text('Generated Line Chart', 20, 10);
          const imgWidth = doc.internal.pageSize.getWidth() - 30; // Adjust width to fit the page
          const imgHeight = (canvas.height * imgWidth) / canvas.width; // Adjust height to maintain aspect ratio
          doc.addImage(imgData, 'PNG', 15, 40, imgWidth, imgHeight);
          if (index < reportData.length - 1) {
            doc.addPage();
          }
        });
        doc.save('report.pdf');
      });
    } else {
      doc.save('report.pdf');
    }
  };

  const getName = (pk) => {
    if (pk.startsWith('group')) {
      const group = groups.find((group) => `group#${group.PK}` === pk);
      return group ? `group - ${group.integratorGroupName}` : pk;
    } else {
      const integrator = integrators.find(
        (integrator) => `integrator#${integrator.PK}` === pk
      );
      return integrator ? integrator.serialNumber : pk;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('default', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className='diagramsContainer'>
      {role.isManager || role.isService ? (
        <Sidebar className='sidebar' />
      ) : null}
      <div className='mainContent'>
        <h1>Generate Report</h1>
        {error && <p className='error'>{error}</p>}
        {validationError && (
          <div className='validationError'>{validationError}</div>
        )}
        {role.isService && (
          <div className='managerSelect'>
            <label htmlFor='manager'>Select Manager:</label>
            <select
              id='manager'
              value={selectedManager}
              onChange={handleManagerChange}
            >
              <option value=''>Choose...</option>
              {managers.map((manager) => (
                <option key={manager.PK} value={manager.PK}>
                  {
                    manager.cognitoAttributes.find(
                      (attr) => attr.Name === 'given_name'
                    )?.Value
                  }{' '}
                  {
                    manager.cognitoAttributes.find(
                      (attr) => attr.Name === 'family_name'
                    )?.Value
                  }
                </option>
              ))}
            </select>
          </div>
        )}
        <div className='form'>
          <div>
            <label>Report Name:</label>
            <input
              type='text'
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
            />
          </div>
          <div>
            <label>Select PK:</label>
            <select
              value={selectedPK}
              onChange={(e) => setSelectedPK(e.target.value)}
            >
              <option value=''>Choose...</option>
              {integrators.map((integrator) => (
                <option
                  key={integrator.PK}
                  value={`integrator#${integrator.PK}`}
                >
                  {integrator.serialNumber}
                </option>
              ))}
              {groups.map((group) => (
                <option key={group.PK} value={`group#${group.PK}`}>
                  {group.integratorGroupName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Range Start:</label>
            <input
              type='datetime-local'
              value={rangeStart}
              onChange={(e) => setRangeStart(e.target.value)}
            />
          </div>
          <div>
            <label>Range End:</label>
            <input
              type='datetime-local'
              value={rangeEnd}
              onChange={(e) => setRangeEnd(e.target.value)}
            />
          </div>
          <button className='btn' onClick={handleAddData}>
            Add Data
          </button>
          <div className='selectedData'>
            <h3>Selected Data</h3>
            <ul>
              {data.map((item, index) => (
                <li key={index}>
                  <p>Integrator: {getName(item.PK)}</p>
                  <p>
                    Range: {formatFullDate(item.RangeStart)} -{' '}
                    {formatFullDate(item.RangeEnd)}
                  </p>
                  <p>isGroup: {item.isGroup ? 'Yes' : 'No'}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button className='btn' onClick={handleCreateReport}>
          Create Report
        </button>
        <h2>Generated Reports</h2>
        <ul>
          {reports.map((report) => (
            <li key={report.reportID}>
              <p>{report.reportName}</p>
              <button
                className='btn'
                onClick={() => handleViewReport(report.reportID)}
              >
                View
              </button>
              <button className='btn' onClick={handleGeneratePDF}>
                Generate PDF
              </button>
              {viewReport === report.reportID && reportData && (
                <div ref={chartRef}>
                  <ResponsiveContainer width='100%' height={400}>
                    <LineChart
                      data={reportData.flatMap((r) => r[1])}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey='SK' tickFormatter={formatDate}>
                        <Label
                          value='Time'
                          offset={0}
                          position='insideBottom'
                        />
                      </XAxis>
                      <YAxis
                        label={{
                          value: 'Total Crushed',
                          angle: -90,
                          position: 'insideLeft',
                        }}
                      />
                      <Tooltip />
                      <Legend />
                      {reportData.map(([key, values], index) => (
                        <Line
                          key={key}
                          type='monotone'
                          dataKey='totalCrushed'
                          data={values}
                          name={getName(key)}
                          stroke={`#${Math.floor(
                            Math.random() * 16777215
                          ).toString(16)}`}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Diagrams;
