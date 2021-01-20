import React, { useState } from 'react';
import axios from 'axios';
import JSZip from 'jszip';
import { useDropzone } from 'react-dropzone';
import './App.css';

const App = () => {
  const [convertedData, setConvertedData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(true);
  const [options, setOptions] = useState({
    height: '',
    width: '',
    quality: '80',
    format: 'webp'
  });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpeg, image/png,image/jpg',
    maxFiles: 12,
    onDrop: (acceptedFiles, filesRejected) => {
      setFiles(acceptedFiles);
      setRejectedFiles(filesRejected);
      setConvertedData([]);
    }
  });

  const handleSubmit = async () => {
    setDataLoaded(false);
    try {
      const bodyFormData = new FormData();
      bodyFormData.append('height', options.height);
      bodyFormData.append('width', options.width);
      bodyFormData.append('quality', options.quality);
      bodyFormData.append('format', options.format);
      files.forEach(file => bodyFormData.append('files', file));
      const res = await axios({
        method: 'POST',
        // url: 'http://localhost:3000/convertImages',
        url: 'https://jitendra-personal-website.herokuapp.com/convertImages',
        data: bodyFormData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.status === 1) {
        setConvertedData(res.data.files);
        setError(null);
      } else {
        setError(res.data.message);
        setConvertedData([]);
      }
      setDataLoaded(true);
    } catch (err) {
      setError(err.message);
      setDataLoaded(true);
    }
  };

  const removeUploadFile = (data, ind, type) => {
    if (type === 1) {
      setFiles(data.filter((item, index) => index !== ind));
      setConvertedData(convertedData.filter((item, index) => index !== ind));
    } else setRejectedFiles(data.filter((item, index) => index !== ind));
  };

  const handleDownload = () => {
    const zip = new JSZip();
    convertedData.map(item =>
      zip.file(item.fileName, `data:application/pdf;base64,${item.fileData}`)
    );
    zip.generateAsync({ type: 'base64' }).then(base64 => {
      const link = document.createElement('a');
      link.href = 'data:application/zip;base64,' + base64;
      link.download = 'convertedImages';
      link.click();
      link.remove();
    });
  };

  const downloadFile = index => {
    const dataURI = `data:application/pdf;base64,${convertedData[index].fileData}`;
    const link = document.createElement('a');
    document.body.appendChild(link);
    if (navigator.appVersion.toString().includes('.NET')) {
      const binary = atob(convertedData[index].fileData.replace(/\s/g, ''));
      const len = binary.length;
      const buffer = new ArrayBuffer(len);
      const view = new Uint8Array(buffer);
      for (let i = 0; i < len; i += 1) {
        view[i] = binary.charCodeAt(i);
      }
      const fileBlob = new Blob([view], {
        type: 'application/pdf'
      });
      window.navigator.msSaveBlob(fileBlob, convertedData[index].fileName);
    } else {
      link.href = dataURI;
      link.download = convertedData[index].fileName;
      link.click();
    }
    link.remove();
  };

  const renderFiles = files.map((file, index) => {
    return (
      <tr key={file.path}>
        <td>{index + 1}</td>
        <td>{file.name}</td>
        <td>{(Number(file.size) / 1024).toFixed(2)} kb</td>
        <td>
          {convertedData[index] ? `${convertedData[index].size} kb` : 'N/A'}
        </td>
        <td>
          {convertedData.length > 0 && (
            <button
              className="button"
              type="button"
              onClick={() => downloadFile(index)}
            >
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M5.016 18h13.969v2.016h-13.969v-2.016zM18.984 9l-6.984 6.984-6.984-6.984h3.984v-6h6v6h3.984z"></path>
              </svg>
            </button>
          )}
          <button
            className="button"
            type="button"
            onClick={() => removeUploadFile(files, index, 1)}
          >
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M18.984 3.984v2.016h-13.969v-2.016h3.469l1.031-0.984h4.969l1.031 0.984h3.469zM6 18.984v-12h12v12q0 0.797-0.609 1.406t-1.406 0.609h-7.969q-0.797 0-1.406-0.609t-0.609-1.406z"></path>
            </svg>
          </button>
        </td>
        <td>{file.remarks}</td>
      </tr>
    );
  });

  const renderRejectedFiles = rejectedFiles.map((item, index) => {
    const { file, errors } = item;
    return (
      <tr key={file.path}>
        <td>{files.length + index + 1}</td>
        <td>{file.name}</td>
        <td>{file.size} kb</td>
        <td>N/A</td>
        <td>
          <button
            className="button"
            type="button"
            onClick={() => removeUploadFile(rejectedFiles, index, 2)}
          >
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18.984 3.984v2.016h-13.969v-2.016h3.469l1.031-0.984h4.969l1.031 0.984h3.469zM6 18.984v-12h12v12q0 0.797-0.609 1.406t-1.406 0.609h-7.969q-0.797 0-1.406-0.609t-0.609-1.406z"></path>
            </svg>
          </button>
        </td>
        <td>
          <ul>
            {errors.map(e => (
              <li key={e.code}>{e.message}</li>
            ))}
          </ul>
        </td>
      </tr>
    );
  });

  return (
    <main>
      {!dataLoaded && (
        <section className="loaderWrap">
          <div className="loader"></div>
        </section>
      )}
      <header>
        <h2>Convert Images 2 WebP</h2>
      </header>
      <section className="container">
        <div {...getRootProps({ className: 'dropzoneContainer' })}>
          <input {...getInputProps()} />
          <p>
            Drag &quot;n&quot; drop some files here, or click to select files
          </p>
          <em>(Only images will be accepted)</em>
        </div>
        <div className="form_container">
          <div>
            <label htmlFor="format">Format</label>
            <select
              id="format"
              onChange={e => setOptions({ ...options, format: e.target.value })}
              value={options.format}
            >
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
              <option value="jpg">JPG</option>
            </select>
          </div>
          <div>
            <label htmlFor="quality">Quality</label>
            <input
              name="quality"
              id="quality"
              type="number"
              max="100"
              min="0"
              onChange={e =>
                setOptions({ ...options, quality: e.target.value })
              }
              value={options.quality}
            />
          </div>
          <div>
            <h5>Resize :</h5>
          </div>
          <div>
            <label htmlFor="width">Width</label>
            <input
              name="width"
              id="width"
              type="text"
              onChange={e => setOptions({ ...options, width: e.target.value })}
              value={options.width}
            />
          </div>
          <div>
            <label htmlFor="height">Height</label>
            <input
              name="height"
              id="height"
              type="text"
              onChange={e => setOptions({ ...options, height: e.target.value })}
              value={options.height}
            />
          </div>
        </div>
        {error && <div className="errorMessage">{error}</div>}
        <div>
          <button
            disabled={!files.length}
            type="button"
            className="button submitBtn"
            onClick={handleSubmit}
          >
            Submit
          </button>
          {convertedData.length > 1 && (
            <button
              type="button"
              className="button downloadBtn"
              onClick={handleDownload}
            >
              Download All(zip)
            </button>
          )}
        </div>
      </section>
      {(files.length > 0 || rejectedFiles.length > 0) && (
        <section className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>S. No.</th>
                <th>File name</th>
                <th>Original file size</th>
                <th>Converted file size(Approx.)</th>
                <th>Actions</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {renderFiles}
              {renderRejectedFiles}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
};

export default App;
