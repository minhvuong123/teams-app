
import axios from 'axios';
import AppReviewFile from 'container/app-review-file/app-review-file';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { API_LINK } from 'shared/const';
import './chat-files.scss';

function ChatFiles({ location }: any) {
  const [files, setfiles] = useState<[]>([]);
  const [reviewUrl, setReviewUrl] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);
  const { conversation } = location.state;

  useEffect(() => {
    async function loadFiles() {
      const fileUrl = `${API_LINK}/files/${conversation._id}`
      const filesStore = await axios.get(fileUrl);

      const { data } = filesStore || {};
      const { files } = data || {};

      if (!isEmpty(files)) {
        setfiles(files);
      }
    }

    loadFiles();
    return () => { };
  }, [])

  function onReviewFile(event: any, url: string): void {
    event.preventDefault();
    setReviewUrl(`${API_LINK}/${url}`);
    setVisible(true);
  }

  function onCloseReview() {
    setVisible(false);
  }

  return (
    <div className="chat-files">
      <div className="files-container">
        <table id="files-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
            {
              !isEmpty(files)
              && files.map((file: any) => {
                return (
                  <tr key={file._id}>
                    <td>
                      <a href='/' onClick={(event) => onReviewFile(event, file.url)}>{file.name}</a>
                    </td>
                    <td>{file.type}</td>
                    <td>{file.size}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
      <AppReviewFile visible={visible} url={reviewUrl} onClose={onCloseReview} />
    </div>
  )
}

export default ChatFiles;
