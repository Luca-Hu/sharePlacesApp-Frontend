import React, { useRef, useState , useEffect } from 'react';
// 每当需要管理sth，并且这些sth也应该更新DOM元素时，就应该使用useState

import Button from './Button';
import './ImageUpload.css';

const ImageUpload = props => {
    const [file, setFile] = useState(); // 管理file
    const [previewUrl, setPreviewUrl] = useState(); // 将为用户提供图片file 的url 预览
    const [isValid, setIsValid] = useState(false); // 该file 是否valid ？

    const filePickerRef = useRef();
    
    useEffect(() => {
        if(!file){
            return; // 如果没有文件，无法生成预览，直接返回
        }
        const fileReader = new FileReader(); // FileReader is API that built into Browser. 该API可以用于生成 file 的url
        fileReader.onload = () => { // onload： this anonymous function 将在fileReader 函数完成之后执行
            setPreviewUrl(fileReader.result); // fileReader.result : 解析为 url 格式的文件
        };
        fileReader.readAsDataURL(file); // 注意 readAsDataURL 没有callback，所以为了线程（前面必须执行完毕），必须要加入fileReader.onload()函数
    }, [file]); // useEffect： 除了默认的运行一遍之外，dependency如果change，也会导致重新运行

    const pickedHandler = event => {
        let pickedFile;
        let fileIsValid = isValid;
        // event.target.files: 用于保存用户选中的文件
        if(event.target.files && event.target.files.length === 1) { // 仅当有且仅有一个file时才能够选定
            pickedFile = event.target.files[0];
            setFile(pickedFile);
            setIsValid(true); // setState 并不会立即更新，而是scedule update，所以我们需要使用能够立即更新的fileIsValid 来传入onInput函数中
            fileIsValid = true;
        } else { 
            setIsValid(false);
            fileIsValid = false;
        }
        props.onInput(props.id, pickedFile, fileIsValid);
    };

    const pickImageHandler = () => { // pickImageHandler 被触发之后应该可以访问 file picker, 而这需要 useRef 来建立DOM元素之间的连接
        filePickerRef.current.click(); // 直接call click method(相当于系统帮你做了一次点击，触发 file picker )
    };

    return (
        <div className='form-control'>
            <input 
                id={props.id}
                ref={filePickerRef}
                // useRef 建立DOM元素之间的连接，这样我们就可以在看不见这个 "file picker" 的状态下使用它
                style={{display : 'none' }} 
                type="file"    // 这个属性指定了这个input是一个 filer picker, 系统将提供文件以供选择
                accept=".jpg, .png, .jpeg"
                onChange={pickedHandler} 
                // 将这个input的 onChange 作为 pickedHandler 的触发event 之一
            />
            {/* 这个input实际是一个 “file picker” ： 选择"不可见"，因为样式太简陋. */}

            <div className={`image-upload ${props.center && 'center'}`}>
                <div className="image-upload__preview"> 
                    {previewUrl && <img src={previewUrl} alt="Preview" />}
                    {/* Debug: src 不要写错为 arc */}
                    {!previewUrl && 
                        <div>
                            <p>Please pick an image file.</p>
                            <p>File larger than 5MB is not accepted.</p>
                        </div>
                    }
                </div>
                <Button type="button" onClick={pickImageHandler}>PICK AN IMAGE</Button>
                {/* onClick 监听器，当button被点击之后，执行其中的函数 pickImageHandler。这个函数将打开file picker 组件。 我们需要管理file，并把需要的file传回该表单中*/}
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    )
};

export default ImageUpload;