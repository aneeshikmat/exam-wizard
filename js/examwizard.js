(function ($) {
    $.fn.examWizard = function (options) {
       
        // default options.
        var _defaults = {
            currentQuestionSelector:'#currentQuestionNumber',
            totalOfQuestionSelector:'#totalOfQuestion',
            formSelector:           '#examwizard-question',
            currentQuestionLabel:   '#current-question-number-label',
            alternateNameAttr:      'data-alternateName',
            alternateValueAttr:     'data-alternateValue',
            alternateTypeAttr:      'data-alternateType',
            quickAccessOption: {
                quickAccessSection:     '#quick-access-section',
                enableAccessSection:    true,
                quickAccessPagerItem:   'Full',
                quickAccessInfoSelector:'#quick-access-info',
                quickAccessPrevSelector:'#quick-access-prev',
                quickAccessNextSelector:'#quick-access-next',
                quickAccessInfoSeperator:'/',
                quickAccessRow:         '.question-response-rows',
                quickAccessRowValue:    '.question-response-rows-value',
                quickAccessDefaultRowVal:'-',
                quickAccessRowValSeparator: ', ',
                nextCallBack            :function(){},
                prevCallBack            :function(){},
            },
            nextOption: {
                nextSelector:           '#go-to-next-question',
                allowadNext:            true,
                callBack:               function(){},
                breakNext:             function(){return false;},
            },
            prevOption: {
                prevSelector:           '#back-to-prev-question', 
                allowadPrev:            true,
                allowadPrevOnQNum:      2,
                callBack:               function(){},
                breakPrev:              function(){return false;},
            },
            finishOption: {
                enableAndDisableFinshBtn:true,
                enableFinishButtonAtQNum:'onLastQuestion',
                finishBtnSelector:      '#finishExams',
                enableModal:            false,
                finishModalTarget:      '#finishExamsModal',
                finishModalAnswerd:     '.finishExams-total-answerd',
                finishModalMarked:      '.finishExams-total-marked',
                finishModalRemaining:   '.finishExams-total-remaining',
                callBack:               function(){}
            },
            markOption: {
                markSelector:           '.mark-question',
                unmarkSelector:         '.unmark-question',
                markedLinkSelector:     '.marked-link',
                markedQuestionsSelector:'#markedQuestion',
                markedLabel:            'Marked',
                markUnmarkWrapper:      '.mark-unmark-wrapper',
                enableMarked:           true,
                markCallBack:           function(){},
                unMarkCallBack:         function(){},
            },
            cookiesOption: {
                enableCookie:           false,
                cookieKey:              '',
                expires:                1*24*60*60*1000 // 1 day
            }
        };
        
        // extends options.
        var settings = $.extend(true, {}, _defaults, options);
        
        /*
         * Get Marked Values
         * @returns {json parse or null}
         */
        function _getMarkedValue(){
            var markedValues = $(settings.markOption.markedQuestionsSelector).val();
            markedValues = JSON.parse(markedValues);
            
            return markedValues;
        }
        
        /*
         * Current Question Number
         * @returns {Integer}
         */
        function _getCurrentQuestionNumber(){
            return parseInt($(settings.currentQuestionSelector).val());
        }
        
        /*
         * Prev Question Number
         * @returns {Integer}
         */
        function _getPrevQuestionNumber(){
            return _getCurrentQuestionNumber() - 1;
        }
        
        /*
         * Next Question Number
         * @returns {Integer}
         */
        function _getNextQuestionNumber(){
            return _getCurrentQuestionNumber() + 1;
        }
        
        /*
         * Total Number of questions
         * @returns {Integer}
         */
        function _getTotalOfQuestion(){
            return parseInt($(settings.totalOfQuestionSelector).val());
        }
        
        /*
         * Get All Data In form
         * @var alternateName bool used to return all form data or only fields has an alternateName attributes 
         * @returns {Array}
         */
        function _getAllFormData(alternateName = false){
            if(alternateName){
                return $('['+settings.alternateNameAttr+']').serializeArray();
            }
            
            return $(settings.formSelector).serializeArray();
        }
        
        /*
         *   Next Question Action
         */
        $(document).on('click', settings.nextOption.nextSelector,function () {
            var currentQuestionNumber       = _getCurrentQuestionNumber();// Current Question Number
            var currentNextQuestionNumber   = _getNextQuestionNumber(); // Next Question Number
            var totalOfQuestion             = _getTotalOfQuestion(); // Total Number of questions
            
            /*
             * Conditin to stop next action
             */
            var breakNext = settings.nextOption.breakNext();
            if(breakNext){
                return 0;
            }
            
            if(currentQuestionNumber < totalOfQuestion && settings.nextOption.allowadNext){
                $(settings.currentQuestionSelector).val(currentNextQuestionNumber);
                $(settings.formSelector +' [data-question="'+currentQuestionNumber+'"]').addClass('hidden');
                $(settings.formSelector +' [data-question="'+currentNextQuestionNumber+'"]').removeClass('hidden');
                
                // Update Current Question Number Label
                updateCurrentQuestionNumberLabel(currentNextQuestionNumber);
                
                // Enable Prev Button
                if(settings.prevOption.allowadPrev && currentNextQuestionNumber >= settings.prevOption.allowadPrevOnQNum){
                    $(settings.prevOption.prevSelector).removeClass('disabled');
                }
                
                // Enable And Disable Finish Button
                _enableAndDisableFinishButton();
                
                // Hide And Show marks buttons for current question
                markUnMarkWrapperToggle(currentNextQuestionNumber);

                // CallBack function
                settings.nextOption.callBack();
            }

             // Disablied OR Enable Next Btn
            if(totalOfQuestion == currentNextQuestionNumber || !settings.nextOption.allowadNext){
                $(settings.nextOption.nextSelector).addClass('disabled');
            }
        });

        /*
         *   Prev Question Action
         */
        $(document).on('click', settings.prevOption.prevSelector,function () {
            var currentQuestionNumber       = _getCurrentQuestionNumber();// Current Question Number
            var currentPrevQuestionNumber   = _getPrevQuestionNumber(); // Prev Question Number
            
            /*
             * Conditin to stop next action
             */
            var breakPrev = settings.prevOption.breakPrev();
            if(breakPrev){
                return 0;
            }
            
            if(currentQuestionNumber > 1 && settings.prevOption.allowadPrev){
                $(settings.currentQuestionSelector).val(currentPrevQuestionNumber);
                $(settings.formSelector +' [data-question="'+currentQuestionNumber+'"]').addClass('hidden');
                $(settings.formSelector +' [data-question="'+currentPrevQuestionNumber+'"]').removeClass('hidden');
                
                // Update Current Question Number Label
                updateCurrentQuestionNumberLabel(currentPrevQuestionNumber);
                
                // Enable Next Button
                if(settings.nextOption.allowadNext){
                    $(settings.nextOption.nextSelector).removeClass('disabled');
                }
                
                // Enable And Disable Finish Button
                _enableAndDisableFinishButton();
                
                // Hide And Show marks buttons for current question
                markUnMarkWrapperToggle(currentPrevQuestionNumber);
                
                // CallBack function
                settings.prevOption.callBack();
            }
            
             // Disablied OR Enable Next Btn
            if(currentPrevQuestionNumber <= 1 || !settings.prevOption.allowadPrev || currentPrevQuestionNumber < settings.prevOption.allowadPrevOnQNum){
                $(settings.prevOption.prevSelector).addClass('disabled');
            }
        });
        
        /*
         *   Mark Question Action
         */
        $(document).on('click', settings.markOption.markSelector,function () {
            var currentQNumber = $(this).data('question');
            updateMarkOnQuickAccess(currentQNumber, 0);
            handlingMarkCookies();
            // CallBack function
            settings.markOption.markCallBack();
        });
        
        /*
         *   Un Mark Question Action
         */
        $(document).on('click', settings.markOption.unmarkSelector,function () {
            var currentQNumber = $(this).data('question');
            updateMarkOnQuickAccess(currentQNumber, 1);
            handlingMarkCookies();
            // CallBack function
            settings.markOption.unMarkCallBack();
        });
        
        /*
         *  Marked Link Question Action
         */
        $(document).on('click', settings.markOption.markedLinkSelector,function () {
                var markedQuestionNumber       = $(this).data('question');
                var totalOfQuestion            = _getTotalOfQuestion(); // Total Number of questions
                
                $(settings.currentQuestionSelector).val(markedQuestionNumber);
                $(settings.formSelector +' [data-question]').addClass('hidden');
                $(settings.formSelector +' [data-question="'+markedQuestionNumber+'"]').removeClass('hidden');
                
                // Update Current Question Number Label
                updateCurrentQuestionNumberLabel(markedQuestionNumber);
                
                // Hide And Show marks buttons for current question
                markUnMarkWrapperToggle(markedQuestionNumber);
                
                // Disablied OR Enable Next Btn
                if(markedQuestionNumber <= 1 || !settings.prevOption.allowadPrev || markedQuestionNumber < settings.prevOption.allowadPrevOnQNum){
                    $(settings.prevOption.prevSelector).addClass('disabled');
                }else{
                    $(settings.prevOption.prevSelector).removeClass('disabled');
                }
                
                // Disablied OR Enable Next Btn
                if(totalOfQuestion == markedQuestionNumber || !settings.nextOption.allowadNext){
                    $(settings.nextOption.nextSelector).addClass('disabled');
                }else{
                    $(settings.nextOption.nextSelector).removeClass('disabled');
                }
        });
        
        /*
         *  Trigger Finish Button 
         */
        $(document).on('click', settings.finishOption.finishBtnSelector,function () {
            var totalQuestion = _getTotalOfQuestion();
            var currentQuestionNumber = _getCurrentQuestionNumber();
            
            if(validateIfIsInteger(settings.finishOption.enableFinishButtonAtQNum)){
                totalQuestion = settings.finishOption.enableFinishButtonAtQNum;
            }

            if(currentQuestionNumber >= totalQuestion){
                if(settings.finishOption.enableModal){
                    $(settings.finishOption.finishModalAnswerd).html(getTotalOfAnswerdQuestion());
                    $(settings.finishOption.finishModalMarked).html(getTotalOfMarkedQuestion());
                    $(settings.finishOption.finishModalRemaining).html(getTotalOfRemainingQuestion());
                    $(settings.finishOption.finishModalTarget).modal('show');
                }

                // CallBack function
                settings.finishOption.callBack();
            }
        });
        
        /*
         *  Quick Access Prev Trigger
         */
        $(document).on('click', settings.quickAccessOption.quickAccessPrevSelector,function () {
            if(settings.quickAccessOption.enableAccessSection){
                quickAccessAction('Prev');
                setQuickAccessResponseForAllData();
                
                // CallBack function
                settings.quickAccessOption.prevCallBack();
            }
        });
        
        /*
         *  Quick Access Next Trigger
         */
        $(document).on('click', settings.quickAccessOption.quickAccessNextSelector,function () {
            if(settings.quickAccessOption.enableAccessSection){
                quickAccessAction('Next');
                setQuickAccessResponseForAllData();
                
                // CallBack function
                settings.quickAccessOption.nextCallBack();
            }
        });
        
        /*
         *  Trigger On Question
         */
        $(document).on('change select keyup', '['+settings.alternateNameAttr+']',function () {
            var currentQNumber  = _getCurrentQuestionNumber();
            var answerdValue    = getAllAnswerdValue(true, true, $(this).attr('name'));
            var markedValues    = _getMarkedValue();
            
            if(!$.isEmptyObject(answerdValue)){
                _convertAnswerdToReadAnswerd(answerdValue);
                // Add cookie value if cookie is enable
                if(settings.cookiesOption.enableCookie){
                    handlingCookies(answerdValue);
                }
            }else{
                var fieldVal = null;
                if(settings.markOption.enableMarked && markedValues.indexOf(currentQNumber) > -1){
                    fieldVal = getMarkedLink(currentQNumber);
                }

                setQuickAccessResponseValue(fieldVal, currentQNumber);
                // If cookie enable, delete cookie when its null 
                if(settings.cookiesOption.enableCookie){
                    deleteCookie($(this).attr('name'));
                }
            }
            
        });
        
        /*
         * Funvtion to get All answerd value
         * @returns {array}
         */
        function getAllAnswerdValue(groupingData = false, getAlternateAnswerdOnly = true, fieldName = false){
            var formsValue = _getAllFormData(getAlternateAnswerdOnly);
            
            // If we found field name, then serlize answerd for this field only
            if(fieldName){
                formsValue = $('[name="'+fieldName+'"]').serializeArray();
            }
            
            var result = {};
            var resultCounter = 0;// Index For Array
            
            for(var i = 0; i < formsValue.length; i++){
                if(!formsValue[i].value){// if Empty Value ignore it
                    continue;
                }
                
                var tempVal = $("[name='"+formsValue[i].name+"'][value='"+(formsValue[i].value).replace(/'/g, '\"')+"']");
                // If we dont find an attr name, find by name only - this condtion help us to get data from fields has not an value attribute like textarea, text..etc
                if(!tempVal.attr(settings.alternateNameAttr)){
                    tempVal = $("[name='"+formsValue[i].name+"']");
                }
                
                // Handling Select Option
                if(tempVal.attr(settings.alternateTypeAttr) === 'select'){
                    var selectFieldData = tempVal.find('option:selected');
                    selectFieldData.each(function(){// to get an alternave value for selected option (for one or multible select)
                        if($(this).val() === formsValue[i].value){
                            tempVal.attr(settings.alternateValueAttr, $(this).attr(settings.alternateValueAttr));
                        }
                    });
                }
                
                var currentQNumber = tempVal.parents('[data-question]').data('question');
                var objResult = {'name': formsValue[i].name, 'value':formsValue[i].value, 'alternateName':tempVal.attr(settings.alternateNameAttr), 'alternateValue':tempVal.attr(settings.alternateValueAttr), 'currentQNumber': currentQNumber};
                if(groupingData){
                    if(!result[formsValue[i].name]){
                        result[formsValue[i].name] = {};
                    }
                    
                    result[formsValue[i].name][i] = objResult;
                }else{
                    result[resultCounter++] = objResult;
                }
            }

            return result;
        }
        
        /*
        *   Show & Hide Mark & Unmark Link for each question
        */
        function markUnMarkWrapperToggle(currentQuestionNumber) {
            if(settings.markOption.enableMarked){
                $(settings.markOption.markUnmarkWrapper).addClass('hidden');
                $(settings.markOption.markUnmarkWrapper + '[data-question="'+currentQuestionNumber+'"]').removeClass('hidden');
            }
        }
        
        /*
        * Function used to returen Marked Link
        */
        function getMarkedLink(currentQuestionNumber = 0) {
            var markedLinkClass = settings.markOption.markedLinkSelector.substr(1);
            return '<a href="javascript:void(0);" class="'+markedLinkClass+'" data-question="'+currentQuestionNumber+'">'+settings.markOption.markedLabel+'</a>';
        };
        
        /*
         * Function is used to enable and disable finsih button as devloper need
         */
        function _enableAndDisableFinishButton(){
            if(settings.finishOption.enableAndDisableFinshBtn === true){// If we need to trigger enable and disable button
                var totalQuestion = _getTotalOfQuestion();
                var currentQuestionNumber = _getCurrentQuestionNumber();
                
                /* Condtion to enable button on sepesfic number (like enable button when user on question 5),
                 ** by default its will be enable on the last qestion
                 */
                if(validateIfIsInteger(settings.finishOption.enableFinishButtonAtQNum)){
                    totalQuestion = settings.finishOption.enableFinishButtonAtQNum;
                }

                if(currentQuestionNumber >= totalQuestion){
                    $(settings.finishOption.finishBtnSelector).removeClass('disabled');
                }else{
                    $(settings.finishOption.finishBtnSelector).addClass('disabled');
                }
            }
        }
        
        /*
         * Function Used to update label for current question number
         */
        function updateCurrentQuestionNumberLabel(questionNumber)
        {
            $(settings.currentQuestionLabel).html(questionNumber);
        }
        
        // Call Quick Access Wrapper Controller
        if(settings.quickAccessOption.enableAccessSection){
            controlQuickAccessWithPager();
        }
        
        /*
         * Function used to build and handling Quick Access
         */
        function controlQuickAccessWithPager()
        {
            var group = settings.quickAccessOption.quickAccessPagerItem;
            if(settings.quickAccessOption.quickAccessPagerItem !== 'Full' 
            && validateIfIsInteger(group)){
                var total = _getTotalOfQuestion();
                var numberOfGroub = Math.ceil(total / group);
                var currentPage = $(settings.quickAccessOption.quickAccessInfoSelector).attr('data-current-page');
                if(!currentPage){
                    currentPage = 1;
                    $(settings.quickAccessOption.quickAccessInfoSelector).attr('data-current-page', currentPage);
                }
                
                if(currentPage == 1){
                    $(settings.quickAccessOption.quickAccessPrevSelector).addClass('disabled');
                }else if(currentPage == numberOfGroub){
                    $(settings.quickAccessOption.quickAccessNextSelector).addClass('disabled');
                }
                
                updateQuickAccessInfo(currentPage, numberOfGroub);
            }
        }
        
        /*
         * NExt & Prev Quick Access Action
         */
        function quickAccessAction(action)
        {
            var currentPage = $(settings.quickAccessOption.quickAccessInfoSelector).attr('data-current-page');
            var total = _getTotalOfQuestion();
            var group = settings.quickAccessOption.quickAccessPagerItem;
            var numberOfGroub = Math.ceil(total / group);
            
            
            if(action === 'Next'){
                currentPage++;
            }else{
                currentPage--;
            }

            if(currentPage >= numberOfGroub){
                $(settings.quickAccessOption.quickAccessNextSelector).addClass('disabled');
            }else{
                $(settings.quickAccessOption.quickAccessNextSelector).removeClass('disabled');
            }
            
            if(currentPage <= 1){
                $(settings.quickAccessOption.quickAccessPrevSelector).addClass('disabled');
            }else{
                $(settings.quickAccessOption.quickAccessPrevSelector).removeClass('disabled');
            }
            
            if(currentPage > numberOfGroub || currentPage < 1){
                return false;
            }
            
            $(settings.quickAccessOption.quickAccessInfoSelector).attr('data-current-page', currentPage);
            updateQuickAccessInfo(currentPage, numberOfGroub);
        }
        
        /*
         * Update Quick Access Info
         */
        function updateQuickAccessInfo(start, end, group = 0)
        {
            if(group === 0){
                group = settings.quickAccessOption.quickAccessPagerItem;
                if(settings.quickAccessOption.quickAccessPagerItem === 'Full' 
                || !validateIfIsInteger(group)){
                    return;
                }
            }
            
            var currentPage = $(settings.quickAccessOption.quickAccessInfoSelector).attr('data-current-page');
            
            $(settings.quickAccessOption.quickAccessSection + ' [data-question]').hide();
            $(settings.quickAccessOption.quickAccessSection + ' [data-question]:nth-child(-n+'+(group * currentPage)+')').show();
            if(currentPage > 1){
                $(settings.quickAccessOption.quickAccessSection + ' [data-question]:nth-child(-n+'+(group * (currentPage - 1))+')').hide();
            }
            $(settings.quickAccessOption.quickAccessInfoSelector).html(start + ' ' + settings.quickAccessOption.quickAccessInfoSeperator + ' ' + end);
        }
        
        
        /*
         * Function To Set Response for quick access section for all data
         */
        function setQuickAccessResponseForAllData(){
            // Get All Answerd Value For Field has an alternate name sorting as a group of objects
            var answerdValue = getAllAnswerdValue(true);
            
            // 
            var listOfNames = _convertAnswerdToReadAnswerd(answerdValue);
            
            // Remove All Unset field
            var allFields = $('['+settings.alternateNameAttr+']');
            allFields.each(function(index){
                var allFieldsName = $(this).attr('name');
                if(!(listOfNames.indexOf(allFieldsName) > -1)){
                    var currentQNumber = $('[name="'+allFieldsName+'"]').parents('[data-question]').data('question');
                    setQuickAccessResponseValue(null, currentQNumber);
                }
            });
            
            // If enable marked, set mark link for marked question
            if(settings.markOption.enableMarked){
                updateAllMarkOnQuickAccess();
            }
        }
        
        /*
        *   Function To Set Value for quick access Section
        */
        function setQuickAccessResponseValue(fieldVal, currentQuestionNumber) {
            if(!fieldVal){
                fieldVal = settings.quickAccessOption.quickAccessDefaultRowVal;
            }
            $(settings.quickAccessOption.quickAccessRow + '[data-question="'+ currentQuestionNumber +'"]' + ' ' + settings.quickAccessOption.quickAccessRowValue).html(fieldVal);
        }
        
        /*
         * Function used to set an read answer and return list of answerd value or answerd string 
         * @param {array} listOfNames used to save an field has value
         * @param {array} listOfAnswerd used to save an answer field has value
         * @param {object} answerdValue
         * @returns {array}
         */
        function _convertAnswerdToReadAnswerd(answerdValue, updateResponse = true, getAnswerdString = false){
            var listOfNamesCounter  = 0;
            var listOfNames         = new Array();
            var listOfAnswerdCounter  = 0;
            var listOfAnswerd       = new Array();
            // Get marked values
            var markedValues        = _getMarkedValue();
            var flagMarked          = false;
            
            // If we found answerd then...
            if(!$.isEmptyObject(answerdValue)){
                // Looping in object
                for(var key in answerdValue){
                    if (answerdValue.hasOwnProperty(key)) {
                        // Get an object value in group
                        var answerdValue2 = answerdValue[key];
                        // Variable to save resault and convert it to one level
                        var rowValue = new Array();
                        var counter  = 0;
                        for(var key2 in answerdValue2){
                            rowValue[counter] = answerdValue2[key2].alternateValue;
                            listOfNames[listOfNamesCounter++] = answerdValue2[key2].name;
                            var currentQuestionNumber = answerdValue2[key2].currentQNumber;
                            if(!rowValue[counter]){
                                rowValue[counter] = answerdValue2[key2].value;
                            }
                            
                            counter++;
                        }
                    }
                    
                    // Convert answerd to be an read answer
                    var val = rowValue.join(settings.quickAccessOption.quickAccessRowValSeparator);
                    
                    // Collect an Read answer in array
                    listOfAnswerd[listOfAnswerdCounter++] = val;
                    
                    
                    if(settings.markOption.enableMarked){
                        flagMarked = markedValues.indexOf(currentQuestionNumber) > -1;
                    }
                    
                    // Update Response Value For Questions
                    if(updateResponse && !flagMarked){
                        setQuickAccessResponseValue(val, currentQuestionNumber);
                    }else if(flagMarked){
                        updateMarkOnQuickAccess(currentQuestionNumber, 2);
                    }
                }
            }
            
            if(getAnswerdString){
                return listOfAnswerd;
            }
            
            return listOfNames;
        }
        
        /*
         * 
         * @param {Integer} 0 is mark action, 1 is unmark action, 2 is update response link on quick access
         * @returns {Boolean}
         */
        function updateMarkOnQuickAccess(currentQNumber, type)
        {
            // Current Question Field Object
            var fieldObj        = $('['+settings.alternateNameAttr+'="answer['+(currentQNumber - 1)+']"]');
            // Get Answerd Value for this question
            var answerdValue    = getAllAnswerdValue(true, true, fieldObj.attr('name'));
            // Get Marked Link
            var markedLink      = getMarkedLink(currentQNumber);
            // Quick Access Object To Update Answers Value in Quick access Section
            var accessObj       = $(settings.quickAccessOption.quickAccessRow + '[data-question="'+ currentQNumber +'"]' 
                                    + ' ' + settings.quickAccessOption.quickAccessRowValue);
            // Mark button Object
            var markButton      = $(settings.markOption.markSelector + '[data-question="'+ currentQNumber +'"]');
            // Un Mark button Object
            var unmarkButton    = $(settings.markOption.unmarkSelector + '[data-question="'+ currentQNumber +'"]');
            // Get marked values
            var markedValues = _getMarkedValue();
            
            if(type === 0){
                markButton.addClass('hidden');
                unmarkButton.removeClass('hidden');
                
                // Add current question number to marked values in hidden fields
                markedValues.push(currentQNumber);
                // Update MarkedValues field
                $(settings.markOption.markedQuestionsSelector).val(JSON.stringify(markedValues));
                
                // Set Marked Link on quick access
                accessObj.html(markedLink);
            }else if(type === 1){
                markButton.removeClass('hidden');
                unmarkButton.addClass('hidden');
                
                // Remove Current Value form markedValues field
                markedValues.splice(markedValues.indexOf(currentQNumber), 1);
                // Update MarkedValues field
                $(settings.markOption.markedQuestionsSelector).val(JSON.stringify(markedValues));
                
                if(!$.isEmptyObject(answerdValue)){
                    _convertAnswerdToReadAnswerd(answerdValue);
                }else{
                    setQuickAccessResponseValue(null, currentQNumber);
                }
            }else if(type === 2){
                // Set Marked Link on quick access
                accessObj.html(markedLink);
            }
        }
        
        /*
         * 
         * @param {type} value
         * @returns {Boolean}
         */
        function updateAllMarkOnQuickAccess()
        {
            // Get marked values
            var markedValues = _getMarkedValue();
            
            for(var key in markedValues){
                var currentQNumber  = markedValues[key];
                // Get Marked Link
                var markedLink      = getMarkedLink(currentQNumber);
                // Quick Access Object To Update Answers Value in Quick access Section
                var accessObj       = $(settings.quickAccessOption.quickAccessRow + '[data-question="'+ currentQNumber +'"]' 
                                        + ' ' + settings.quickAccessOption.quickAccessRowValue);
                                
                // Set Marked Link on quick access
                accessObj.html(markedLink);
            }
            
        }
        
        /*
         * Function to validate if value is integer or no
         * @param {string, integer} value
         * @returns {Boolean}
         */
        function validateIfIsInteger(value)
        {
            return /^\d+$/.test(value);
        }
        
        /*
         * Set Cookie For Question
         * @param {String} cname
         * @param {String} cvalue
         * @param {Integer} exdays
         */
        function setCookie(cname, cvalue)
        {   
            cname += settings.cookiesOption.cookieKey;
            var d = new Date();
            d.setTime(d.getTime() + (settings.cookiesOption.expires));
            var expires = "expires="+ d.toUTCString();
            document.cookie = cname + "=" + cvalue.replace(/;/g, ',') + "{sep};" + expires + ";path=/";
        }
        
        /*
         * Get Cookie For Question
         * @param {String} cname
         * @returns {String}
         */
        function getCookie(allCookies = true, cname = '')
        {
            cname               += settings.cookiesOption.cookieKey;
            var name            = cname + "=";
            var decodedCookie   = decodeURIComponent(document.cookie);
            var ca              = decodedCookie.split('{sep};');
            var result          = new Array();

            for(var i = 0; i <ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if ((allCookies || c.indexOf(name) == 0) && c.indexOf(settings.cookiesOption.cookieKey) > -1) {
                    c = c.replace(settings.cookiesOption.cookieKey, '');
                    if(allCookies){
                        var currentQNumber = c.substr(0, c.indexOf('='));
                        result[currentQNumber] = c.substring(c.indexOf('=') + 1, c.length);
                    }else{
                        return c.substring(name.length, c.length);
                    }
                }
            }
            
            if(allCookies){
                return result;
            }
            
            return '';
        }
        
        /*
         * Delete Cookie
         * @param {String} cname
         */
        function deleteCookie(cname)
        {
            cname += settings.cookiesOption.cookieKey;
            document.cookie = cname + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
        }
        
        /*
         * Function to handling cookies on any update of values
         */
        function handlingCookies(answerdValue)
        {
            for(var key in answerdValue){
                var answerdValue2 = answerdValue[key];
                var rowValue = new Array();
                var counter = 0;
                for(var key2 in answerdValue2){
                    rowValue[counter] = answerdValue2[key2].value;
                    var currentQNumber = answerdValue2[key2].name;
                    counter++;
                }
                
                // Convert value to string
                var val = rowValue.join('{sep}');
                setCookie(currentQNumber, val);
            }
        }
        
        function handlingMarkCookies(values)
        {
            var markedValue = $(settings.markOption.markedQuestionsSelector).val();
            setCookie(settings.markOption.markedQuestionsSelector, markedValue);
        }
        
        // If cookie is enable load answers
        if(settings.cookiesOption.enableCookie){
            $(settings.currentQuestionSelector).val(1);
            loadAnswersFromCookies();
        }
        
        /*
         * Function used to load answers value from cookie and reflect it in form fields
         */
        function loadAnswersFromCookies()
        {
            var oldResult = getCookie();

            for(var key in oldResult){
                var obj  = $("[name='"+key+"']");
                if(key == settings.markOption.markedQuestionsSelector && settings.markOption.enableMarked){
                    var nameQS = $(settings.markOption.markedQuestionsSelector).attr('name');
                    obj = $("[name='"+nameQS+"']");
                }
                var item = oldResult[key].split('{sep}');
                var tempV= new Array();
                var count= 0;
                //deleteCookie(key);
                for(var key2 in item){
                    if(item[key2] == ""){// When item is empty string, ignore it
                        continue;
                    }
                    tempV[count++] = item[key2];
                    if(obj.data('alternatetype') === 'checkbox' || obj.data('alternatetype') === 'radio'){
                        $("[name='"+key+"'][value='"+item[key2]+"']").prop('checked', true);
                    }else{
                        obj.val(item[key2]);
                    }
                }
                
                // If its select, set all selected value
                if(obj.data('alternatetype') === 'select'){
                    obj.val(tempV);
                }
            }
            
            if(settings.quickAccessOption.enableAccessSection){
                setQuickAccessResponseForAllData();
            }
            
            if(settings.markOption.enableMarked){
                var markedValues = _getMarkedValue();
                for(var keyM in markedValues){
                    // Mark button Object
                    var markButton      = $(settings.markOption.markSelector + '[data-question="'+ markedValues[keyM] +'"]');
                    // Un Mark button Object
                    var unmarkButton    = $(settings.markOption.unmarkSelector + '[data-question="'+ markedValues[keyM] +'"]');
                    
                    markButton.addClass('hidden');
                    unmarkButton.removeClass('hidden');
                }
            }     
        }
        
        /*
         * Function to return number of answerd value
         * @returns {Integer}
         */
        function getTotalOfAnswerdQuestion()
        {
            var answers = getAllAnswerdValue(true, true);
            
            return Object.keys(answers).length;
        }
        
        /*
         * Function to return number of marked value
         * @returns {Integer}
         */
        function getTotalOfMarkedQuestion()
        {
            var markeds = _getMarkedValue();
            
            return Object.keys(markeds).length;
        }
        
        /*
         * Function to return number of Remaining Question
         * @returns {Integer}
         */
        function getTotalOfRemainingQuestion()
        {
            var total = _getTotalOfQuestion();
            var remaning = total - getTotalOfAnswerdQuestion();
            
            return remaning;
        }
        
        /*
         * Return Usfall Varialbe to developer
         */
        return {
            getMarkedQuestion: function(){
                return _getMarkedValue();
            },
            getAnswerdValue: function(groupingData = true, fieldWithAlternateNameOnly = true){
                return getAllAnswerdValue(groupingData, fieldWithAlternateNameOnly);
            },
            getTotalOfAnswerdValue: function(){
                return getTotalOfAnswerdQuestion();
            },
            getTotalOfMarkedValue: function(){
                return getTotalOfMarkedQuestion();
            },
            getTotalOfRemainingValue: function(){
                return getTotalOfRemainingQuestion();
            },
            getCurrentQuestionNumber: function(){
                return _getCurrentQuestionNumber();
            },
            getAllFormData: function(){
                return _getAllFormData();
            },
        }
    };
}(jQuery));