//AVISO! ESTE CODIGO É PARA NAVEGORES DESATUALIZADOS!
(function () {
    'use strict';
    window.loaded = false;
    let currentAnswerInstance = null;

    var allAnswerContainer = document.createElement('div');
    allAnswerContainer.id = 'all-container-answer';
    allAnswerContainer.style.backgroundColor = '#ccc';
    allAnswerContainer.style.width = '400px';
    allAnswerContainer.style.maxHeight = '661px';
    allAnswerContainer.style.display = 'flex';
    allAnswerContainer.style.overflowY = 'scroll';
    allAnswerContainer.style.scrollbarColor = 'black #ccc';
    allAnswerContainer.style.flexDirection = 'column';

    var chevronContainer = document.createElement('div');
    chevronContainer.style.width = '400px';
    chevronContainer.style.height = '20px';
    chevronContainer.style.display = 'flex';
    chevronContainer.style.background = 'black';
    chevronContainer.style.justifyContent = 'flex-end';
    chevronContainer.style.alignItems = 'center';

    var chevronIcon = document.createElement('div');
    chevronIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="chevron"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z"/></svg>';
    chevronIcon.style.cursor = 'pointer';
    chevronIcon.style.fill = 'white';
    chevronContainer.appendChild(chevronIcon);

    chevronIcon.addEventListener('click', () => {
        if (allAnswerContainer.style.display === 'none') {
            allAnswerContainer.style.display = 'flex';
            chevronIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="chevron"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>'; // Chevron para cima
        } else {
            allAnswerContainer.style.display = 'none';
            chevronIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="chevron"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z"/></svg>'; // Chevron para baixo
        }
    });

    var topHeader = document.getElementById('top-header-container');
    if (topHeader) {
        var navElement = topHeader.querySelector('nav');
        if (navElement) {
            topHeader.insertBefore(chevronContainer, navElement.nextSibling);
            topHeader.insertBefore(allAnswerContainer, chevronContainer.nextSibling);
        } else {
            topHeader.appendChild(chevronContainer);
            topHeader.appendChild(allAnswerContainer);
        }
    }

    class Answer {
        constructor(answer, type) {
            this.body = answer;
            this.type = type;
            this.imgContainer = document.createElement('div');
            this.imgContainer.style.display = 'flex';
            this.imgContainer.style.width = '100%';
            this.imgContainer.style.alignItems = 'center';
            this.imgContainer.style.justifyContent = 'center';
            this.imgContainer.style.margin = '10px';
            this.imgContainer.style.overflow = 'auto';
            this.imgContainer.style.border = '1px solid white';
            this.imgContainer.style.flexShrink = '0';
            this.textContainer = document.createElement('div');
            this.textContainer.style.fontSize = '14px';
            this.textContainer.style.fontWeight = 'bold';
            this.textContainer.style.color = 'black';
            this.textContainer.style.margin = '10px';
            this.textContainer.style.padding = '5px';
            this.textContainer.style.overflow = 'auto';
            this.textContainer.style.border = '1px solid white';
            this.textContainer.style.flexShrink = '0';
            this.textContainer.style.webkitTextStroke = '.5px black';
        }

        get isMultiChoice() {
            return this.type == "multiple_choice";
        }

        get isFreeResponse() {
            return this.type == "free_response";
        }

        get isExpression() {
            return this.type == "expression";
        }

        get isDropdown() {
            return this.type == "dropdown";
        }

    log() {
        currentAnswerInstance = this;
        var processedText = [];
        var answer = this.body;
        let links = [];
        
        var respostasContainer = document.getElementById('all-container-answer');
        respostasContainer.prepend(this.imgContainer);
        respostasContainer.prepend(this.textContainer);

        answer.forEach(item => {
            if (typeof item === 'string') {
                var linkMatches = item.match(/\[([^\]]+)\]\(([^)]+)\)|!\[(.*?)\]\((.*?)\)/g);
                if (linkMatches) {
                    linkMatches.forEach(match => {
                        var url = match.match(/\(([^)]+)\)/)[1];
                        links.push(url);
                        item = item.replace(match, '');
                    });
                }

                let cleanedItem = item.replaceAll('$', '');
                processedText.push(cleanedItem);
            } else {
                processedText.push(item);
            }
        });

        let text = processedText.filter(item => typeof item !== 'string' || !this.isImageUrl(item)).join('<br>');
        
        let lines = text.split('<br>');
        let formattedLines = lines.map(line => {
            let span = document.createElement('span');
            span.style.display = 'block';
            span.style.maxWidth = '380px';
            span.innerHTML = line;
            return span.outerHTML;
    }).join('');

        this.textContainer.innerHTML = formattedLines;

        respostasContainer.prepend(this.textContainer);

        links.forEach(link => this.printImage(link));
    }

    isImageUrl(url) {
        var isImage = (url.startsWith("https://") || url.startsWith("http://") || url.includes("web+graphie")) && /\.(gif|png|jpg|jpeg|svg)$/i.test(url);
        return isImage;
    }

    printImage(ans) {
        let imageUrl = ans;
        imageUrl = imageUrl.replace(/!\[(.*?)\]\((.*?)\)/g, '$2');
        if (imageUrl.includes("web+graphie")) {
            imageUrl = imageUrl.replace("web+graphie://", "https://");
            var match = imageUrl.match(/]\(([^)]+)\)/);
            if (match && match[1]) {
                imageUrl = match[1] + ".svg";
            }
        }

        if (!/\.(gif|png|jpg|jpeg|svg)$/i.test(imageUrl)) {
            imageUrl += ".svg";
        }

        var imgContainer = document.createElement('div');
        var imgQuestion = document.createElement('img');

        imgQuestion.onload = () => {
            imgQuestion.style.background = 'white';
            imgQuestion.style.width = '100%';
            imgQuestion.style.height = '80px';
            imgContainer.appendChild(imgQuestion);
            this.imgContainer.appendChild(imgContainer);
            var respostasContainer = document.getElementById('all-container-answer');
            respostasContainer.prepend(this.imgContainer);
        };

        imgQuestion.src = imageUrl;
    }
    }

        function createPointSVG(x, y) {
            var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("width", "30");
            svg.setAttribute("height", "30");
            svg.setAttribute("viewBox", "-15 -15 30 30");

            var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", x);
            circle.setAttribute("cy", y);
            circle.setAttribute("r", "5");
            circle.setAttribute("fill", "blue");

            svg.appendChild(circle);
            return svg;
        }

        function sorterAnswerFrom(question) {
            var answer = question.widgets["sorter 1"].options.correct;
            return new Answer([...new Set(answer)], "sorter");
        }

            function matcherAnswerFrom(question, filter = null) {
                var left = question.widgets["matcher 1"].options.left;
                var right = question.widgets["matcher 1"].options.right;
                var answer = [];
            
                for (let i = 0; i < left.length; i++) {
                    if (filter === null || filter.includes(i)) {
                        let leftItem = left[i];
                        let rightItem = right[i];
            
                        var leftContainer = document.createElement("div");
                        leftContainer.style.display = "flex";
                        leftContainer.style.alignItems = "center";
                        leftContainer.style.marginRight = "20px";
            
                        var rightContainer = document.createElement("div");
                        rightContainer.style.display = "flex";
                        rightContainer.style.alignItems = "center";
            
                        leftContainer.appendChild(processItem(leftItem));
            
                        rightContainer.appendChild(processItem(rightItem));
            
                        var rowContainer = document.createElement("div");
                        rowContainer.style.display = "flex";
                        rowContainer.style.alignItems = "center";
                        rowContainer.appendChild(leftContainer);
                        rowContainer.appendChild(rightContainer);
            
                        answer.push(rowContainer);
                    }
                }
            
                var answerInstance = new Answer([], "matcher");
                answerInstance.imgContainer.style.display = "flex";
                answerInstance.imgContainer.style.flexDirection = "column";
                answerInstance.imgContainer.style.alignItems = "flex-start";
            
                answer.forEach(item => {
                    answerInstance.imgContainer.appendChild(item);
                });
            
                answerInstance.log();
                return answerInstance;
            }
            
            function processItem(item) {
                if (item.includes("web+graphie://")) {
                    let imageUrl = item;
            
                    var regex = /!\[.*?\]\((web\+graphie:\/\/.*?)\)/;
                    var match = imageUrl.match(regex);
                    if (match && match[1]) {
                        imageUrl = match[1];
                    }
            
                    imageUrl = imageUrl.replace("web+graphie://", "https://");
            
                    if (!imageUrl.toLowerCase().endsWith(".svg")) {
                        var matchSvg = imageUrl.match(/]\(([^)]+)\)/);
                        if (matchSvg && matchSvg[1]) {
                            imageUrl = matchSvg[1] + ".svg";
                        } else {
                            imageUrl += ".svg";
                        }
                    }
            
                    const img = document.createElement("img");
                    img.src = imageUrl;
                    img.style.width = "80px";
                    img.style.height = "80px";
                    return img;
                } else {
                    var textSpan = document.createElement("span");
                    textSpan.innerHTML = item;
                    return textSpan;
                }
            }
    
        function labelImageAnswerFrom(question) {
            var markers = question.widgets["label-image 1"].options.markers;
            var answer = markers.map(function(marker) {
                return marker.label + ": " + marker.answers.join(", ");
            });
            return new Answer([...new Set(answer)], "label-image");
        }
    
        function interactiveGraphAnswerFrom(question) {
            var coords = question.widgets["interactive-graph 1"].options.correct.coords;
            var answer = coords.map(function(coord) {
                return "(" + coord[0] + ", " + coord[1] + ")";
            });

            var answerInstance = new Answer([...new Set(answer)], "interactive-graph");
            var svgContainer = document.createElement('div');
            svgContainer.style.display = 'flex';
            svgContainer.style.flexWrap = 'wrap';


            coords.forEach(coord => {
                var svg = createPointSVG(coord[0], coord[1]);
                svgContainer.appendChild(svg);
            });
            answerInstance.imgContainer.appendChild(svgContainer);

            return answerInstance;
        }

        function categorizerAnswerFrom(question) {
            let answer = [];
            let itemsData = [];

            for (let widgetName in question.widgets) {
                if (widgetName.startsWith("categorizer")) {
                    var categorizerWidget = question.widgets[widgetName];
                    if (categorizerWidget && categorizerWidget.options) {
                        var categories = categorizerWidget.options.categories;
                        var items = categorizerWidget.options.items;
                        var values = categorizerWidget.options.values;

                        items.forEach((item, index) => {
                            answer.push(item + ": " + categories[values[index]]);
                            itemsData.push({
                                item: item,
                                category: categories[values[index]]
                            });
                        });
                    }
                }
            }

            let answerInstance = new Answer([], "categorizer");
            answerInstance.imgContainer.style.display = "flex";
            answerInstance.imgContainer.style.width = "100%";
            answerInstance.imgContainer.style.alignItems = "center";
            answerInstance.imgContainer.style.justifyContent = "center";
            answerInstance.imgContainer.style.margin = "10px";
            answerInstance.imgContainer.style.overflow = "auto";
            answerInstance.imgContainer.style.border = "1px solid white";
            answerInstance.imgContainer.style.flexShrink = "0";

    itemsData.forEach(itemData => {
        let itemDiv = document.createElement("div");
        itemDiv.style.display = "flex";
        itemDiv.style.flexDirection = "column";
        itemDiv.style.alignItems = "center";
        itemDiv.style.margin = "10px";

        if (itemData.item.startsWith("![") || itemData.item.startsWith("web+graphie://")) {
            let img = document.createElement("img");
            let imageUrl = itemData.item.replace(/!\[(.*?)\]\((.*?)\)/g, '$2').replace("web+graphie://", "https://").replace(/]\(([^)]+)\)/, (match, p1) => p1 + ".svg");

            if (!/\.(gif|png|jpg|jpeg|svg)$/i.test(imageUrl.toLowerCase())) {
                imageUrl += ".svg";
            }
                img.src = imageUrl;
                img.style.width = "80px";
                img.style.height = "80px";
                itemDiv.appendChild(img);
            } else {
                let textSpan = document.createElement("span");
                textSpan.textContent = itemData.item;
                itemDiv.appendChild(textSpan);
            }

            let categoryLabel = document.createElement("span");
            categoryLabel.textContent = itemData.category;
            categoryLabel.style.marginTop = "5px";

            itemDiv.appendChild(categoryLabel);
            answerInstance.imgContainer.appendChild(itemDiv);
        });

            answerInstance.textContainer.innerHTML = answer.join("<br>");
            answerInstance.log();
            return answerInstance;
        }
    
    var originalCreateElement = document.createElement;
    document.createElement = function (tagName) {
        var element = originalCreateElement.call(document, tagName);
        if (tagName.toLowerCase() === 'img') {
            var originalSetAttribute = element.setAttribute;
            element.setAttribute = function (name, value) {
                if (name.toLowerCase() === 'src' && value.includes("web+graphie")) {
                    if (currentAnswerInstance) {
                        currentAnswerInstance.printImage(value);
                    } else {
                        var answerInstance = new Answer();
                        answerInstance.printImage(value);
                    }
                }
                originalSetAttribute.call(this, name, value);
            };
        }
        return element;
    };
                
                    var originalFetch = window.fetch;
                    window.fetch = function () {
                        return originalFetch.apply(this, arguments).then(async (res) => {
                            if (res.url.includes("/getAssessmentItem")) {
                                if (!res.ok) {
                                    console.error("Erro na requisição: " + res.status + " " + res.statusText);
                                    return res;
                                }
                                var clone = res.clone();
                                var json = await clone.json()
                                let item, question, questionId;
                
                                    try {
                                        item = json.data.assessmentItem.item.itemData;
                                        question = JSON.parse(item).question;
                                        questionId = json.data.assessmentItem.id;
                                    } catch {
                                        let errorIteration = () => { return localStorage.getItem("error_iter") || 0; }
                                        localStorage.setItem("error_iter", errorIteration() + 1);
                
                                        if (errorIteration() < 4) {
                                            return location.reload();
                                        } else {
                                            return console.log("%c An error occurred", "color: red; font-weight: bolder; font-size: 20px;");
                                        }
                                    }
                
                                    if (!question) return;

                                    let freeResponseAnswers = [];

                                    Object.keys(question.widgets).forEach(widgetName => {
                                        if (widgetName.startsWith("numeric-input") || widgetName.startsWith("input-number")) {
                                            var widgetAnswers = freeResponseAnswerFrom(question, widgetName).body;
                                            freeResponseAnswers = freeResponseAnswers.concat(widgetAnswers);
                                        }
                                    });
                    
                                    if (freeResponseAnswers.length > 0) {
                                        new Answer(freeResponseAnswers, "free_response").log();
                                    }
                
                                    Object.keys(question.widgets).map(widgetName => {
                                        if (widgetName.startsWith("radio")) {
                                            multipleChoiceAnswerFrom(question).log();
                                        }
                                        if (widgetName.startsWith("expression")) {
                                            expressionAnswerFrom(question).log();
                                        }
                                        if (widgetName.startsWith("dropdown")) {
                                            dropdownAnswerFrom(question).log();
                                        }
                                        if (widgetName.startsWith("sorter")) {
                                            sorterAnswerFrom(question).log();
                                        }
                                        if (widgetName.startsWith("matcher")) {
                                            matcherAnswerFrom(question).log();
                                        }
                                        if (widgetName.startsWith("label-image")) {
                                            labelImageAnswerFrom(question).log();
                                        }
                                        if (widgetName.startsWith("interactive-graph") && question.widgets["interactive-graph 1"]) {
                                            interactiveGraphAnswerFrom(question).log();
                                        }
                                        if (widgetName.startsWith("categorizer")) {
                                            categorizerAnswerFrom(question).log();
                                        }
                                    });
                            }
                
                            if (!window.loaded) {
                                console.clear();
                                console.log("%c   Answer Mod", "color: brown; font-size:40px; font-weight:bolder; padding: .2rem; text-align: center;");
                                console.log(".:::!~!!!!!:.\n                  .xUHWH!! !!?M88WHX:.\n                .X*#M@$!!  !X!M$$$$$$WWx:.\n               :!!!!!!?H! :!$!$$$$$$$$$$8X:\n              !!~  ~:~!! :~!$!#$$$$$$$$$$8X:\n             :!~::!H!<   ~.U$X!?R$$$$$$$$MM!\n             ~!~!!!!~~ .:XW$$$U!!?$$$$$$RMM!\n               !:~~~ .:!M\"T#$$$$WX??#MRRMMM!\n               ~?WuxiW*`   `\"#$$$$8!!!!??!!!\n             :X- M$$$$       `\"T#$T~!8$WUXU~\n            :%`  ~#$$$m:        ~!~ ?$$$$$$\n          :!`.-   ~T$$$$8xx.  .xWW- ~\"\"##*\"\n.....   -~~:<` !    ~?T#$$@@W@*?$$      /`\nW$@@M!!! .!~~ !!     .:XUW$W!~ `\"~:    :\n#\"~~`.:x%`!!  !H:   !WM$$$$Ti.: .!WUn+!`\n:::~:!!`:X~ .: ?H.!u \"$$$B$$$!W:U!T$$M~\n.~~   :X@!.-~   ?@WTWo(\"*$$$W$TH$! `\nWi.~!X$?!-~    : ?$$$B$Wu(\"**$RM!\n$R@i.~~ !     :   ~$$$$$B$$en:``\n?MXT@Wx.~    :     ~\"##*$$$$M~");
                                console.log("%c   Mod by Daniel(GHOST42552@)", "color: gold; font-size:20px; font-weight:bold;");
                                window.loaded = true;
                            }
                
                            return res;
                        });
                    };
                
                    function freeResponseAnswerFrom(question, widgetName) {
                        var widget = question.widgets[widgetName];
                        let answer = [];

                        if (widget.options?.answers) {
                            answer = widget.options.answers.map(answer => {
                                if (answer.status == "correct") {
                                    var exactValue = parseFloat(answer.value)
                                    return exactValue;
                                }
                            }).filter(val => val !== undefined);
                            } else if (widget.options?.inexact == false  && widget.options?.value !== undefined) {
                                var exactValue = parseFloat(widget.options.value);
                                answer = [exactValue];
                            }
                
                        return new Answer(answer, "free_response");
                    }
                
                    function multipleChoiceAnswerFrom(question) {
                        var answer = Object.values(question.widgets).map((widget) => {
                            if (widget.options?.choices) {
                                var correctChoices = widget.options.choices.filter(choice => choice.correct);
                                var noneOfTheAboveChoice = widget.options.choices.find(choice => choice.isNoneOfTheAbove);
                    
                                if (noneOfTheAboveChoice && correctChoices.length === 1 && correctChoices[0].isNoneOfTheAbove) {
                                    return ["Nenhuma das anteriores"];
                                } else {
                                    return widget.options.choices.map(choice => {
                                        if (choice.correct) {
                                            return choice.content;
                                        } else if (choice.isNoneOfTheAbove) {
                                            return null;
                                        }
                                    }).filter(Boolean);
                                }
                            }
                        }).flat().filter(Boolean);
                    
                        return new Answer(answer, "multiple_choice");
                    }
                
                    function expressionAnswerFrom(question) {
                        var answer = Object.values(question.widgets).map((widget) => {
                            if (widget.options?.answerForms) {
                                return widget.options.answerForms.map(answer => {
                                    if (Object.values(answer).includes("correct")) {
                                        return answer.value;
                                    }
                                });
                            }
                        }).flat();
                
                        return new Answer(answer, "expression");
                    }
                
                    function dropdownAnswerFrom(question) {
                        var answer = Object.values(question.widgets).map((widget) => {
                            if (widget.options?.choices) {
                                return widget.options.choices.map(choice => {
                                    if (choice.correct) {
                                        return choice.content;
                                    }
                                });
                            }
                        }).flat();
                
                        return new Answer(answer, "dropdown");
                    }
                })();//NO MATHJAX APPLICATION       
