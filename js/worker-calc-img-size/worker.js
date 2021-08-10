function calcOptimalSises(max_width, max_height, widthOrigin, heightOrigin){
    let multiplier = 1.01;

    let w = widthOrigin;
    let h = heightOrigin;

    let width = w;
    let height = h;

    for (let i = 2; i < w; i++){
        if (w % i === 0 && h % i === 0){
            width /= i;
            height /= i;
        }
    }

    if (width > height){
        let quantity = 0;
        while (width < max_width){
            if ((width * multiplier) > max_width) break;
            width *= multiplier;
            quantity++;
        }

        for (let i = 0; i < quantity; i++){
            height *= multiplier;
        }

        console.log(width);
        console.log(height)
    } else {
        let quantity = 0;
        while (height < max_height){
            if ((height * multiplier) > max_height) break;
            height *= multiplier;
            quantity++;
        }

        for (let i = 0; i < quantity; i++){
            width *= multiplier;
        }

        console.log(width);
        console.log(height)
    }

    
}

function getOriginalIMGSizes(image){
    let reader = new FileReaderSync();
    let readerResult = reader.readAsDataURL(image);
    self.postMessage({
        action: "getOriginalSizes",
        result: readerResult
    });
}


self.onmessage = function(event){
    let data = event.data;
    if (data.operation === "calcMaxSizeOfPhotoOnPreview"){
        calcOptimalSises(data.max_width, data.max_height, data.origin_width, data.origin_height);
    } else if (data.operation === "calcOriginalSizes"){
        getOriginalIMGSizes(data.image);
    }
}