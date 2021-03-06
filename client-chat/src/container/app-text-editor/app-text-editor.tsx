
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';

import { IoIosList } from "react-icons/io";
import {
  AiOutlineRedo,
  AiOutlineUndo,
  // AiOutlineClear,
  AiOutlineDown,
  // AiOutlineTool,
  // AiOutlineSend
} from "react-icons/ai";
import {
  IoCloudUploadOutline
} from "react-icons/io5";
import {
  AiOutlineAlignCenter,
  AiOutlineAlignLeft,
  AiOutlineAlignRight,
  AiOutlineOrderedList
} from "react-icons/ai";

import './app-text-editor.scss';

function AppTextEditor({ value, wrapName, textClass, valueClass, valueTabName, placeholder, isClose, onChange, onClose, onSend }: any) {
  const [previousNode, setPreviousNode] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  const [isStrikeThrough, setIsStrikeThrough] = useState<boolean>(false);
  const [isJustifyLeft, setIsJustifyLeft] = useState<boolean>(false);
  const [isJustifyCenter, setIsJustifyCenter] = useState<boolean>(false);
  const [isJustifyRight, setIsJustifyRight] = useState<boolean>(false);
  const [isInsertOrderedList, setIsInsertOrderedList] = useState<boolean>(false);
  const [isInsertUnOrderedList, setIsInsertUnOrderedList] = useState<boolean>(false);

  const editorRef = useRef() as any;
  const editorFileRef = useRef() as any;

  useEffect(() => {
    if (!value) {
      editorRef.current.innerHTML = value;
    }
    
    return () => {}
  }, [value])

  function onTextEditor(tag: string, option?: string) {
    editorRef.current.focus();
    if (option) {
      setTimeout(() => {
        document.execCommand(tag, false, option);
      }, 0);
    } else {
      setTimeout(() => {
        document.execCommand(tag);
      }, 0);
    }

    switch (tag) {
      case 'bold': setIsBold(!isBold); break;
      case 'italic': setIsItalic(!isItalic); break;
      case 'underline': setIsUnderline(!isUnderline); break;
      case 'strikeThrough': setIsStrikeThrough(!isStrikeThrough); break;
      case 'justifyLeft': 
        setIsJustifyLeft(!isJustifyLeft); 
        setIsJustifyCenter(false); 
        setIsJustifyRight(false); 
        break;
      case 'justifyCenter': 
        setIsJustifyCenter(!isJustifyCenter); 
        setIsJustifyLeft(false); 
        setIsJustifyRight(false); 
        break;
      case 'justifyRight': 
        setIsJustifyRight(!isJustifyRight); 
        setIsJustifyCenter(false); 
        setIsJustifyLeft(false); 
        break;
      case 'insertOrderedList': setIsInsertOrderedList(!isInsertOrderedList); break;
      case 'insertUnorderedList': setIsInsertUnOrderedList(!isInsertUnOrderedList); break;
    }
  }

  function onUploadImageClick(): void {
    if (editorFileRef?.current) {
      editorFileRef?.current.click();
    }
  }

  async function onUploadImageChange(event: any): Promise<void> {
    editorRef.current.focus();
    const files = event.target.files;

    for await (const file of files) {
      const base64Url = await getBase64(file) as any;
      const wrappedselection = `<img data-id="${uuid()}" data-name="${file.name}" data-type="${file.type}" data-size="${file.size}" src="${base64Url}" >`;
      document.execCommand('insertHTML', false, wrappedselection);
      // document.execCommand('insertImage', false, base64Url);

    //   const prefix = `img data-id="1234" data-name="${file.name}" data-type="${file.type}"`;
    //   image.outerHTML = htmlTemplate[0] + prefix + htmlTemplate[1];
    }

    // reset value to continue upload to the same image
    event.target.value = '';
  }

  function getBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  function onCloseEditor(): void {
    onClose(!isClose);
  }

  function onChangeEditor(event: any): void {
    const value = event.target.innerHTML;
    const valueParserHtml = `<${valueTabName} class="${valueClass}">${value}</${valueTabName}>`;

    if(!value) { 
      setIsInsertOrderedList(false);
      setIsInsertUnOrderedList(false);
    }

    // setContent(value);
    onChange(valueParserHtml);
  }

  function onKeyDownEditor(event: any): void {
    const selection = document.getSelection() as any;
    // if (selection?.baseNode?.children.lastChild.localName === "img" && event.key === 'Backspace') {
    //   const filesTemp = [...files];
    //   filesTemp.pop();
    // } else if (selection?.baseNode?.parentNode && event.key === 'Backspace') {
    //   if (previousNode !== selection?.baseNode?.parentNode?.localName) {
    //     // reset command is actived
    //     // ... code here follow to previousNode
    //     setPreviousNode(selection?.baseNode?.parentNode?.localName); // store to previousNode
    //   }
    // }

    // get current selection
    // var sel = window.getSelection() as any;
    // if (sel.rangeCount > 0) {
    //     var range = sel.getRangeAt(0);
    //     var node = range.startContainer;
    //     if (node.hasChildNodes() && range.startOffset > 0) {
    //         node = node.childNodes[range.startOffset - 1];
    //     }
    // }
  }

  return (
    <div className={wrapName}>
      <div className="editor-container">
        {
          isClose &&
          <div className="editor-header">
            <div className="item-group">
              <button 
                type="button" 
                className={`text-item text-bold ${isBold ? 'active': ''}`} 
                onClick={() => onTextEditor('bold')} title="Bold"
              >
                <p className="text-content">B</p>
              </button>
              <button 
                className={`text-item text-italic ${isItalic ? 'active': ''}`} 
                onClick={() => onTextEditor('italic')} 
                title="Italic"
              >
                <p className="text-content">I</p>
              </button>
              <button 
                className={`text-item text-underline ${isUnderline ? 'active': ''}`} 
                onClick={() => onTextEditor('underline')} 
                title="Underline"
              >
                <p className="text-content">U</p>
              </button>
              <button 
                className={`text-item text-strike-through ${isStrikeThrough ? 'active': ''}`} 
                onClick={() => onTextEditor('strikeThrough')} 
                title="Line Through"
              >
                <p className="text-content">S</p>
              </button>
            </div>
            {/* <div className="item-group">
              <div className={`text-item text-fontColor ${}`} onClick={() => onTextEditor('italic')} title="Font Color"><p className="text-content">A</p></div>
              <div className={`text-item text-backColor ${}`} onClick={() => onTextEditor('italic')} title="Font Background"><p className="text-content">A</p></div>
            </div> */}
            <div className="item-group">
              <button 
                className={`text-item text-justifyLeft ${isJustifyLeft ? 'active': ''}`} 
                onClick={() => onTextEditor('justifyLeft')} 
                title="Text Left"
              >
                <p className="text-content"><AiOutlineAlignLeft /></p>
              </button>
              <button 
                className={`text-item text-justifyCenter ${isJustifyCenter ? 'active': ''}`} 
                onClick={() => onTextEditor('justifyCenter')} 
                title="Text Center"
              >
                <p className="text-content"><AiOutlineAlignCenter /></p>
              </button>
              <button 
                className={`text-item text-justifyRight ${isJustifyRight ? 'active': ''}`} 
                onClick={() => onTextEditor('justifyRight')} 
                title="Text Right"
              >
                <p className="text-content"><AiOutlineAlignRight /></p>
              </button>
            </div>
            <div className="item-group">
              <button 
                className={`text-item text-insertOrderedList ${isInsertOrderedList ? 'active': ''}`} 
                onClick={() => onTextEditor('insertOrderedList')} 
                title="Order List"
              >
                <p className="text-content"><AiOutlineOrderedList /></p>
              </button>
              <button 
                className={`text-item text-insertUnorderedList ${isInsertUnOrderedList ? 'active': ''}`} 
                onClick={() => onTextEditor('insertUnorderedList')} 
                title="Unorder List"
              >
                <IoIosList />
              </button>
            </div>
            {/* <div className="item-group">
              <div className="text-item text-super" onClick={() => onTextEditor('superscript')} title="Super"><p className="text-content">X<span className="super">2</span></p></div>
              <div className="text-item text-sub" onClick={() => onTextEditor('subscript')} title="Sub"><p className="text-content">X<span className="sub">2</span></p></div>
            </div> */}
            <div className="item-group">
              <button 
                className="text-item text-insertImage" 
                onClick={() => onUploadImageClick()} title="Upload"
              >
                <p className="text-content"><IoCloudUploadOutline /></p>
              </button>
            </div>
            <div className="item-group">
              <button 
                className="text-item text-redo" 
                onClick={() => onTextEditor('redo')} title="Redo"
              >
                <p className="text-content"><AiOutlineRedo /></p>
              </button>
              <button 
                className="text-item text-undo" 
                onClick={() => onTextEditor('undo')} 
                title="Undo"
              >
                <p className="text-content"><AiOutlineUndo /></p>
              </button>
            </div>
            {/* <div className="item-group">
              <button 
                className="text-item text-removeFormat" 
                onClick={() => onTextEditor('removeFormat')} 
                title="Clear Format"
              >
                <p className="text-content"><AiOutlineClear /></p>
              </button>
            </div> */}
            <div className="item-group">
              <button 
                className="text-item text-close" 
                onClick={() => onCloseEditor()} 
                title="Clear Format"
              >
                <p className="text-content"><AiOutlineDown /></p>
              </button>
            </div>
          </div>
        }
        <input 
          className="editor-file" 
          style={{display: 'none'}} 
          onChange={onUploadImageChange}
          type="file" 
          multiple
          ref={editorFileRef}
        />
        <div
          className={['editor-input', textClass].join(' ')}
          ref={editorRef}
          onInput={onChangeEditor}
          onKeyDown={onKeyDownEditor}
          contentEditable={true}
          data-placeholder={placeholder}
        />
      </div>
    </div>
  );
}

export default AppTextEditor;

