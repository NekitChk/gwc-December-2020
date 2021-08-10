// (function(){
//     if ("serviceWorker" in navigator){
//         navigator.serviceWorker.register("sw.js").then(function(response){
//             console.log(response);
//             if (response.installing){
//                 console.log("SW INSTALLING");
//             } else if (response.waiting){
//                 console.log("SW INSTALLED");
//             }
//         });
//     } else{
//         alert("Браузер устарел. Обновите.")
//     }
// })();

class bootScreen{
    constructor(){
        this.bootScreenData = `<div class = "loadScreenContent"><div class = "loadScreenLOGO" style = "position:absolute;top:50%;left:50%;transform:translate(-50%, -50%); width:40vh; height:26vh"><div class = "logo" style = "position:absolute; width:100%; height:100%; background: url('https://cloud.chkdev.ru/image/main/logo/logoWhiteTR-old.png') no-repeat; background-size:cover;"></div></div></div>`
    }

    showBootScreen(fadeIn){
        this.screen = document.createElement("div");
        this.screen.className = "bootScreen";
        this.screen.innerHTML = this.bootScreenData;
        this.screen.style.cssText = `position:absolute;width:100%;height:100%;z-index:10000;background-color:#000000;top:0;`;
        document.body.style.visibility = "visible";
        document.body.append(this.screen);
        if (fadeIn){
            let screen = document.querySelector(".bootScreen");
            this.fadeIn(screen);
        };
    }
    fadeOut(el){

        el.style.opacity = 1;
      
        (function fade() {
            if ((el.style.opacity -= 0.05) < 0) {
                el.style.display = "none";
            } else {
                requestAnimationFrame(fade);
            }
        })();
    }

    fadeIn(el){
        el.style.opacity = 0;
        el.style.display = "block";
        (function fade() {
            var val = parseFloat(el.style.opacity);
            if (!((val += .1) > 1)) {
                el.style.opacity = val;
                requestAnimationFrame(fade);
            }
        })();
    
    }

    deleteBootScreen(){
        let screen = document.querySelector(".bootScreen");
        this.fadeOut(screen);
        setTimeout(() => screen.remove(), 1000);
    }
}

window.bootScreenObj = new bootScreen();
window.bootScreenObj.showBootScreen();


class authWindow{
    constructor(){
        let _this = this;
        this.initWindowOnLoad();
        this.initWS();
        this.initButtonListener();
        // this.checkSW();
    }

    async initWS(){
        await this.connectWSS();
        this.initWSFunctions();
        let _this = this;
        this.webSocket.onmessage = function(event){
            _this.handleWSSMessage(JSON.parse(event.data));
        }
    }

    initWSFunctions(){
        let _this = this;
        let functionNewAccountCreated = function(){
            let nick = document.querySelector("#login").value;
            if (_this.nick(nick)){
                _this.startMainPage();
                window.userName = nick;
            } else{
                alert("Неправильный ник")
            }
        }

        let functionWrongPassword = function(){
            alert("Вы ввели incorrect p♂ASS♂word для this account. Please, try again, ♂jabroni♂.")
        }

        let functionLoginned = function(){
            let nick = document.querySelector("#login").value;
            if (_this.nick(nick)){
                _this.startMainPage();
                window.userName = nick;
            } else{
                alert("Неправильный ник")
            }
        }

        this.wsMap = new Map([
            ["NewAccountCreated", functionNewAccountCreated],
            ["wrongpASSwordError", functionWrongPassword],
            ["LoginedIn", functionLoginned],
            
        ]);
    }

    initWindowOnLoad(){
        let _this = this;
        window.onload = function(){
            _this.windowOnLoad();
        }
    }

    windowOnLoad(){
        buttonAnimation(".buttonAuthContainer");                                                                                                      
        let animations = new authWindowAnimations();
        setTimeout(() => {
            window.bootScreenObj.deleteBootScreen();
        }, 300);

        setTimeout(() => {
            animations.initAnimations();
        }, 500);


    }

    handleWSSMessage(data){
        this.wsMap.get(data.response)(data);
    }

    async connectWSS(){
        let _this = this;
        let promise = new Promise(function(resolve, reject){
            _this.webSocket = new WebSocket("wss://gateway.chkdev.ru:1337");
            window.webSocket = _this.webSocket;
            _this.webSocket.onopen = function(){
                resolve();
            }
        }).then(function(){
            return 1;
        })

        await promise;

    }

    initButtonListener(){
        this.buttonSignIn = document.querySelector(".buttonAuthContainer");

        this.buttonSignIn.addEventListener("click", function(){
            let loginForm = document.querySelector("#login");
            let passWordForm = document.querySelector("#password");
            let userData = {
                login: loginForm.value,
                password: passWordForm.value,
            };
            
            let webSocketDATA = {
                action: "UserLogin",
                userName: userData.login,
                password: userData.password,
            }

            window.authWindowObj.webSocket.send(JSON.stringify(webSocketDATA));
        })
    }

    startMainPage(){
        let animations = new authWindowAnimationsDisable();
        animations.disableAuth();
        setTimeout(() => {
            window.bootScreenObj.showBootScreen(true);
        }, 1000)
        setTimeout(() => {
            window.loginnedWindowObj = new logginedWindow();
            window.loginnedWindowObj.init();
            let appLogin = document.querySelector(".appLogin");
            let loginBackground = document.querySelector(".backgroundImage");
            loginBackground.remove();
            appLogin.remove();
        }, 1500);
    }

    nick(nick){
        let self = this;
        this.incorrect = false;
        this.allowedSyms = ["q","w","e","r","t","y","u","i","o","p","a","s","d","f","g","h","j","k","l","z","x","c","v","b","n","n","m", ".", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M"];
        let nickSplit = nick.split("");
        console.log(nickSplit)
        nickSplit.forEach(function(element){
            if (self.allowedSyms.indexOf(element) == "-1"){
                self.incorrect = true;
            }
        })

        return !(this.incorrect);
    }


    
}


class authWindowAnimations{
    constructor(){
        this.authWindow = document.querySelector(".authWindow");
        this.authText = document.querySelector(".authTextContainer");
        this.authComment = document.querySelector(".authComment");
        this.authDescription = document.querySelector(".authDescriptionContainer");
        this.loginClass = document.querySelector(".login");
        this.passwordClass = document.querySelector(".password");
        this.submitButton = document.querySelector(".button");
        this.appLogin = document.querySelector(".appLogin");
        this.bottomContainer = document.querySelector(".bottomContainer");
        this.backgroundDIV = document.querySelector(".backgroundImage .image");
        this.BGOverlay = document.querySelector(".backgroundImage .overlay");
        this.EVLogoContainer = document.querySelector(".evLogoContainer .evLogoIMGC");
        this.userWidth = document.documentElement.clientWidth;
        this.userHeight = document.documentElement.clientHeight;
    }
    initAnimations(){
        this.authWindowVisibility();
    }



    authWindowVisibility(){
        this.authWindow.classList.remove("authWindowInVisible");
        setTimeout(() => {
            this.showAuthText();
        }, 200);

    }
    showAuthText(){
        this.authText.classList.remove("authTextInVisible");
        setTimeout(() => {
            this.showAuthComment();
        }, 200);
    }
    showAuthComment(){
        this.authComment.classList.remove("authCommentInVisible");
        setTimeout(() => {
            this.showAuthDescription();
        }, 200);
    }

    showAuthDescription(){
        this.authDescription.classList.remove("authDescriptionContInVisible");
        setTimeout(() => {
            this.showLogin();
        }, 200);
    }

    showLogin(){
        this.loginClass.classList.remove("loginInVisible");
        setTimeout(() => {
            this.showPassword();
        }, 200);
    }

    showPassword(){
        this.passwordClass.classList.remove("passwordInVisible");
        setTimeout(() => {
            this.showSubmitButton();
        }, 200);
    }
    showSubmitButton(){
        this.submitButton.classList.remove("buttonInVisible");
        if(this.userWidth >= 950 || this.userHeight >= 600){
            setTimeout(() => {
                new authWindowOptimization();
            }, 200);
        }
        this.loadBackgroundImage();
    }

    showFullAppLogin(){
        this.appLogin.classList.remove("appLoginMinimized");
        this.authWindow.classList.add("authWindowFull");
        this.bottomContainer.classList.add("bottomContainerDown");
        setTimeout(() => {
            this.logoLoadImage();
        }, 200);
    }

    async logoLoadImage(){
        this.logoEVimg = document.querySelector(".evLogoIMGC .evLogoIMG");
        this.imgAjaxSettings = {
            url: "https://gwc.chkdev.ru/logo/logoTechnologies.png",
            method: "GET",
        }
        this.url = URL.createObjectURL(await(await fetch("https://gwc.chkdev.ru/logo/ev.png")).blob());
        this.logoEVimg.src = this.url;
    }
    
    async loadBackgroundImage(){
        this.url = URL.createObjectURL(await(await fetch("https://gwc.chkdev.ru/imgs/2.jpg")).blob());
        this.backgroundDIV.style.backgroundImage = `url("${this.url}")`;
        setTimeout(() => {
            this.BGOverlay.classList.remove("BGOverlayopacity1");
        }, 200);
    }
}


class authWindowAnimationsDisable extends authWindowAnimations{
    constructor(){
        super();
    }

    disableAuth(){
        this.EVLogoContainer.classList.add("evLogoContainerInVisible");
        setTimeout(() => {
            this.disableEvLogo();
        }, 200);
    }

    disableEvLogo(){
        this.authWindow.classList.remove("authWindowFull");
        this.bottomContainer.classList.remove("bottomContainerDown");
        this.appLogin.classList.add("appLoginMinimized");
        setTimeout(() => {
            this.disableFullAuthWindow();
        }, 200);
    }

    disableFullAuthWindow(){
    }
}

class authWindowOptimization extends authWindowAnimations{
    constructor(){
        super();
        if (this.userWidth <= 950 || this.userHeight <= 600){
            this.goToMinVersion();
        } else{
            this.goToFullVersion();
        }
    }
    goToMinVersion(){
        this.appLogin.classList.add("appLoginMinimized");
        this.authWindow.classList.remove("authWindowFull");
        this.bottomContainer.classList.remove("bottomContainerDown");
        this.EVLogoContainer.classList.add("evLogoContainerInVisible");
    }

    goToFullVersion(){
        super.showFullAppLogin();
        setTimeout(() => {
            this.EVLogoContainer.classList.remove("evLogoContainerInVisible");
        }, 500);

    }
}





window.authWindowObj = new authWindow();


class logginedWindow{
    async init(){
        await this.loadContent();
        //PAGE READY
        window.messagesInput = new MessageInput();
        this.ws();
        this.loadMessages();
        this.startMessageUpdates(); //ALEXEI CYKA
        this.initEvents();
        this.initKeyEvents();
        this.initAudio();
        document.body.setAttribute("onresize", "new logginedWindowOptimization()");
        this.entityMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;',
        };
    }

    initAudio(){
        this.woopAudio = new Audio("https://gwc.chkdev.ru/audio/woop.mp3");
    }

    startMessageUpdates(){
        let requestObj = {
            action: "GetNew",
        }
        this.updateInterval = setInterval(() => {
            window.webSocket.send(JSON.stringify(requestObj));
        }, 1000);
    }

    initEvents(){
        this.buttonSend = document.querySelector(".message_send");
        let MI = window.messagesInput;
        let attachObj;

        this.sendFunction = function(){

            if (window.messagesInput.value.length === 0 && MI.uploadFileList.length === 0) return;

            if (MI.uploadFileList.length === 0) attachObj = {};

            if (MI.uploadFileList.length > 0){
                attachObj = Object.assign({}, MI.uploadFileList);
            }

            let sendObj = {
                action: "send",
                content: MI.value,
                attachments: attachObj,
            };
            
            window.webSocket.send(JSON.stringify(sendObj));
            MI.clear();
        }

        this.buttonSend.addEventListener("click", this.sendFunction);

    }

    initKeyEvents(){
        let self = this;
        this.keyHandle = function(event){
            if (event.key === "Enter"){
                self.sendFunction();
            }
        }

        window.onkeydown = this.keyHandle;
    }

    async loadContent(){
        this.htmlFetchRequest = await fetch("https://gwc.chkdev.ru/htmlContent/main.html");
        this.htmlData = await this.htmlFetchRequest.text();
        this.addMainHtmlToBody();

        this.messageContentRequest = await fetch("https://gwc.chkdev.ru/htmlContent/message.html");
        this.messageContent = await this.messageContentRequest.text();

        this.gwcUploadPreviewRequest = await fetch("https://gwc.chkdev.ru/htmlContent/photoPreview.html");
        this.gwcPhotoPreview = await this.gwcUploadPreviewRequest.text();

        window.gwcPhotoPreview = this.gwcPhotoPreview;
        window.messageContent = this.messageContent;
    }

    addMainHtmlToBody(){
        let element = document.createElement("div");
        element.className = "gwcMainContent";
        element.innerHTML = this.htmlData;
        document.body.prepend(element);
        new logginedWindowOptimization();
        window.onresize = function(){
            new logginedWindowOptimization();
        }
        window.bootScreenObj.deleteBootScreen();
        this.loadBGImage();
    }

    async loadBGImage(){
        let imageCont = document.querySelector(".background .backgroundImage");
        let overlay = document.querySelector(".background .overlay");
        let bgOverlayClassName = "BGOverlayopacity1";
        this.backgroundImageFetch = await fetch("https://gwc.chkdev.ru/imgs/2.jpg");
        this.backgroundBlob = await this.backgroundImageFetch.blob();
        this.bgURL = URL.createObjectURL(this.backgroundBlob);
        imageCont.style.backgroundImage = `url(${this.bgURL})`;
        overlay.classList.remove(bgOverlayClassName);
    }

    ws(){
        let _this = this;
        window.webSocket.onmessage = function(event){
            _this.handleWSMessage(JSON.parse(event.data));
        }

        this.getAllOKFunction = function(data){
            _this.loadMessages(data);
        }

        this.getNewOkFunction = function(data){
            let dataEvents = data.data;
            for (let i = 0; i < dataEvents.length; i++){
                let event = dataEvents[i];
                if (event.type === "message"){
                    _this.addMessage(event);
                    _this.playWoop();           
                }
            }
        }

        this.WSMAp = new Map([
            ["GetAll ok", this.getAllOKFunction],
            ["GetNew ok", this.getNewOkFunction],
        ]);
    }

    handleWSMessage(message){
        this.WSMAp.get(message.response)(message);
    }

    isObjectEmpty(object){
        return (Object.keys(object).length === 0);
    }

    loadMessages(messages = null){
        this.messageList = document.querySelector(".messages_list_center");
        this.messageListSeparator = document.querySelector(".messages_list_center .separator");
        this.messagesContainer = document.querySelector(".messages_container");
        if (!messages){
            let request = {
                action: "GetAll",
            };
            window.webSocket.send(JSON.stringify(request));
        } else {
            let messagesList = messages.data;
            for (let i = 0; i < messagesList.length; i++){
                let messageElement = messagesList[i];
                if (messageElement.type === "message"){
                    this.addMessage(messageElement);
                }
            }
        }
    }

    addMessage(data){
        let element = document.createElement("chkdev-gwc-message");
        this.messSizes = this.messagesContainer.getBoundingClientRect();
        this.messageListSeparator.before(element);
        element.userName = new SocrFileName(40, data.userName).fileSocrWithoutExt;
        element.userMessage =  this.escapeHtml(data.content);
        if (!this.isObjectEmpty(data.attachments)){
            for (let i = 0; i < Object.keys(data.attachments).length; i++){
                let attachment = data.attachments[i];
                element.addPhotoAttachment(attachment);
            }
        }


        if (this.messagesContainer.scrollHeight > this.messSizes.height){
            console.log("scrolling")
            this.messagesContainer.scrollTo({
                top: this.messagesContainer.scrollHeight,
                behavior: "smooth",
            })
        }

    }

    playWoop(){
        this.woopAudio.play();
    }


      
    escapeHtml (string) {
        let self = this;
        return String(string).replace(/[&<>"'`=\/]/g, function (s) {
            return self.entityMap[s];
        });
    }

}


class logginedWindowOptimization{
    constructor(){
        console.log("optimizing");
        this.userWidth = document.documentElement.clientWidth;
        this.userHeight = document.documentElement.clientHeight;

        this.gwcMainContent = document.querySelector(".gwcMainContent .mainContent");
        this.gwcMainContentSizes = this.gwcMainContent.getBoundingClientRect();

        this.sendMessageCont = document.querySelector(".send_message_cont");
        this.sendMessgeContSizes = this.sendMessageCont.getBoundingClientRect();

        this.messagesList = document.querySelector(".messages_container");

        this.messagesContainer = document.querySelector(".messages_container");
        this.optimization();
    }

    optimization(){
        this.optimizeBody();
        this.optimizeMessageHContainer();
        this.scrollToDown();
    }

    optimizeBody(){
        document.body.style.width = `${this.userWidth}px`;
        document.body.style.height = `${this.userHeight}px`;
    }
    
    optimizeMessageHContainer(){
        this.messagesList.style.height = `${this.gwcMainContentSizes.height - this.sendMessgeContSizes.height}px`;
    }

    scrollToDown(){
        this.messagesContainer.scrollTo({
            top: this.messagesContainer.scrollHeight,
            behavior: "instant",
        })
    }


}


class chkGwcMessage extends HTMLElement{
    constructor(){
        super();
    }

    connectedCallback(){
        this.innerHTML = window.messageContent;
        this.userNameHTML = this.querySelector(".userNameText");
        this.userMessageHTML = this.querySelector(".userMessageText");
        this.userPhoto = this.querySelector(".userPhoto");
        this.attachmentsContainer = this.querySelector(".attachments");
    }

    /**
     * @param {string} userName
     */
    set userName(userName){
        this.userNameHTML.innerHTML = userName;
    }

    /**
     * @param {string} userMessage
     */
    set userMessage(userMessage){
        this.userMessageHTML.innerHTML = userMessage;
    }

    get height(){
        return this.getBoundingClientRect().height;
    }

    addPhotoAttachment(dataObj){
        let max_width = document.querySelector(".messages_list_center").getBoundingClientRect().width - 100;
        let sizes;
        if (dataObj.width < max_width && dataObj.height < 300){
            sizes = {
                optimized_width: dataObj.width,
                optimized_height: dataObj.height,
            };
        } else{
            sizes = window.messagesInput.getOptimalIMGPreviewSizes({width: dataObj.width, height: dataObj.height}, max_width, 300);
        }

        let imgElement = document.createElement("img");
        imgElement.src = dataObj.url;
        imgElement.width = sizes.optimized_width;
        imgElement.height = sizes.optimized_height;
        this.attachmentsContainer.append(imgElement);
    }


    
}

class gwcUploadImagePreview extends HTMLElement{
    constructor(){
        super();
    }

    connectedCallback(){
        this.innerHTML = window.gwcPhotoPreview;
        this.img = this.querySelector(".imagePreview");

        this.content = this.querySelector(".content");
        this.width = this.getAttribute("width");
        this.height = this.getAttribute("height");

        this.style.width = this.width + "px";
        this.style.height = this.height + "px";
        
        this.img.style.width = this.width + "px";
        this.img.style.height = this.height + "px";
    }

    /**
     * @param {any} value
     */
    set previewURL(value){
        this.img.src = value;
    }
}

window.customElements.define("gwc-upload-image-preview", gwcUploadImagePreview);
window.customElements.define("chkdev-gwc-message", chkGwcMessage);


class MessageInput{
    constructor(){
        this.messageInput = document.querySelector(".messageIn");
        this.attachPhotoIcon = document.querySelector(".attachIcon");
        this.photoInput = document.querySelector(".uploadPhotoInput");
        this.sendMessageContainer = document.querySelector(".send_message_cont");
        this.uploadAttachContainer = document.querySelector(".uploadContentElementsContainer");
        this.uploadFileList = new Array();
        this.setEvent();
    }
    get value(){
        return this.messageInput.value;
    }

    get expanded(){
        return this.sendMessageContainer.classList.contains("expanded");
    }

    set value(value){
        this.messageInput.value = value;
    }

    setEvent(){
        let self = this;
        this.iconClickFunction = function(){
            self.photoInput.click();
        };
        this.attachPhotoIcon.addEventListener("click", this.iconClickFunction);
    }

    async upload(){
        let file = this.photoInput.files[0];
        if (!file.type.startsWith("image/")) return;
        if (!this.expanded) this.expande();

        new photoUpload(file);

    }
    expande(){
        this.sendMessageContainer.classList.add("sendCexpanded");
    }

    de_expande(){
        this.sendMessageContainer.classList.remove("sendCexpanded");
    }

    clear(){
        this.uploadAttachContainer.innerHTML = "";
        this.value = "";
        this.photoInput.value = "";
        this.uploadFileList = [];
        this.de_expande();
        new logginedWindowOptimization();
        setTimeout(() => {
            new logginedWindowOptimization();
        }, 500);
    }

    getOptimalIMGPreviewSizes(origin_sizes, max_width, max_height){

        let new_width, new_height = 0;
        let rw = origin_sizes.width / max_width;
        let rh = origin_sizes.height / max_height;

        if (rw > rh){
            new_height = Math.round(origin_sizes.height / rw);
            new_width = max_width;
        } else{
            new_width = Math.round(origin_sizes.width / rh);
            new_height = max_height;
        }

        return {
            optimized_width: new_width,
            optimized_height: new_height,
        };

    }
    
}

class photoUpload extends MessageInput{
    constructor(file){
        super();
        this.file = file;
        this.tempFileUploadUID = "F" + (CryptoJS.SHA256(file.name + file.size + file.lastModified + random(0, 99999))).toString();
        this.start();
    }

    async start(){
        await this.addAttachToUI();
        setTimeout(() => {
            this.upload();
        }, 500)
    }

    async upload(){
        let self = this;

        let formdata = new FormData();
        formdata.append("image", this.file);

        let server = await this.getOptimalServer();
        let url = "https://" + server + "/gwc/upload.php";

        this.xhr = new XMLHttpRequest();
        this.xhr.open("POST", url);
        this.xhr.responseType = "json";
        this.xhr.send(formdata);

        this.xhr.onload = function(){
            if (self.xhr.readyState === 4){
                if (self.xhr.status === 200){
                    let settingsObj = {
                        type: "photo",
                        url: self.xhr.response.url,
                        width: self.origin_sizes.width,
                        height: self.origin_sizes.height,
                    };
                    window.messagesInput.uploadFileList.push(settingsObj);
                    self.showLoadedIMGToPreview(settingsObj.url);
                } else{
                    console.error("XHR Failed: " + xhr.status + " " + xhr.statusText);
                }
            } else{
                console.error("INRS");
            }
        }
    }

    showLoadedIMGToPreview(url){
        this.element.previewURL = url;
    }


    async getOptimalServer(){
        let settings = {
            size: this.file.size,
            type: this.file.type,
        };
        let fetchSettings = {
            method: "POST",
            body: JSON.stringify(settings),
        };
        let fetchRequest = await fetch("https://gwc.chkdev.ru/ajax/optServer.php", fetchSettings);
        let fetchData = await fetchRequest.json();
        return await fetchData.server;
    }

    async addAttachToUI(){
        this.element = document.createElement("gwc-upload-image-preview");
        this.element.setAttribute("data-uploadTempUID", this.tempFileUploadUID);

        this.sizes_calc_worker = new Worker("https://gwc.chkdev.ru/js/worker-calc-img-size/worker.js");
        this.origin_sizes = await this.getPhotoSizes();
        let optimalSizes = this.getOptimalIMGPreviewSizes(this.origin_sizes, 150, 90);

        this.element.setAttribute("width", optimalSizes.optimized_width);
        this.element.setAttribute("height", optimalSizes.optimized_height);

        this.uploadAttachContainer.append(this.element);
        new logginedWindowOptimization();

    }

    async getPhotoSizes(){
        let self = this;
        let tempElement = document.createElement("img");
        let promise = new Promise(function(resolve, reject){
            self.sizes_calc_worker.postMessage({
                operation: "calcOriginalSizes",
                image: self.file,
            });
            self.sizes_calc_worker.onmessage = function(event){
                if (event.data.action === "getOriginalSizes"){
                    tempElement.src = event.data.result;
                    resolve(1);
                };
            };
        });

        await promise;

        return{
            width: tempElement.width,
            height: tempElement.height,
        };

    }
}