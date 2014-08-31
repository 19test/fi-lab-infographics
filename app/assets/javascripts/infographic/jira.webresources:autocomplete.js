/* module-key = 'jira.webresources:autocomplete', location = '/includes/jira/dropdown/Dropdown.js' */
JIRA.Dropdown=function(){var instances=[];return{addInstance:function(){instances.push(this)},hideInstances:function(){var that=this;jQuery(instances).each(function(){if(that!==this){this.hideDropdown()}})},getHash:function(){if(!this.hash){this.hash={container:this.dropdown,hide:this.hideDropdown,show:this.displayDropdown}}return this.hash},displayDropdown:function(){if(JIRA.Dropdown.current===this){return }this.hideInstances();JIRA.Dropdown.current=this;this.dropdown.css({display:"block"});this.displayed=true;var dd=this.dropdown;if(window.JIRA&&!window.JIRA.Dialog.current){setTimeout(function(){var win=jQuery(window);var minScrollTop=dd.offset().top+dd.prop("offsetHeight")-win.height()+10;if(win.scrollTop()<minScrollTop){jQuery("html,body").animate({scrollTop:minScrollTop},300,"linear")}},100)}},hideDropdown:function(){if(this.displayed===false){return }JIRA.Dropdown.current=null;this.dropdown.css({display:"none"});this.displayed=false},init:function(trigger,dropdown){var that=this;this.addInstance(this);this.dropdown=jQuery(dropdown);this.dropdown.css({display:"none"});jQuery(document).keydown(function(e){if(e.keyCode===9){that.hideDropdown()}});if(trigger.target){jQuery.aop.before(trigger,function(){if(!that.displayed){that.displayDropdown()}})}else{that.dropdown.css("top",jQuery(trigger).outerHeight()+"px");trigger.click(function(e){if(!that.displayed){that.displayDropdown();e.stopPropagation()}else{that.hideDropdown()}e.preventDefault()})}jQuery(document.body).click(function(){if(that.displayed){that.hideDropdown()}})}}}();JIRA.Dropdown.Standard=function(trigger,dropdown){var that=begetObject(JIRA.Dropdown);that.init(trigger,dropdown);return that};JIRA.Dropdown.AutoComplete=function(trigger,dropdown){var that=begetObject(JIRA.Dropdown);that.init=function(trigger,dropdown){this.addInstance(this);this.dropdown=jQuery(dropdown).click(function(e){e.stopPropagation()});this.dropdown.css({display:"none"});if(trigger.target){jQuery.aop.before(trigger,function(){if(!that.displayed){that.displayDropdown()}})}else{trigger.click(function(e){if(!that.displayed){that.displayDropdown();e.stopPropagation()}})}jQuery(document.body).click(function(){if(that.displayed){that.hideDropdown()}})};that.init(trigger,dropdown);return that};AJS.namespace("jira.widget.dropdown",null,JIRA.Dropdown);
/* module-key = 'jira.webresources:autocomplete', location = '/includes/jira/autocomplete/AutoComplete.js' */
JIRA.AutoComplete=function(){var inFocus;var delay=function(callback,l){if(delay.t){clearTimeout(delay.t);delay.t=undefined}delay.t=setTimeout(callback,l*1000)};var INVALID_KEYS={9:true,13:true,14:true,25:true,27:true,38:true,40:true,224:true};return{dispatcher:function(){},getSavedResponse:function(){},saveResponse:function(){},renderSuggestions:function(){},disable:function(){this.disabled=true},enable:function(){this.disabled=false},set:function(options){for(var name in options){if(options.hasOwnProperty(name)){this[name]=options[name]}}},completeField:function(value){if(value){this.field.val(value).focus();this.field.trigger("change")}},textToSuggestionCursorPosition:function(){return this.field.val()},_makeRequest:function(options){var that=this,requestParams=AJS.copyObject(options);if(this.pendingRequest){this.pendingRequest.abort()}requestParams.complete=function(){that.pendingRequest=null};requestParams.error=function(xhr){if(!xhr.aborted&&xhr.status!==0&&options.error){options.error.apply(this,arguments)}};return this.pendingRequest=JIRA.SmartAjax.makeRequest(requestParams)},addSuggestionControls:function(suggestionNodes){var that=this;var evaluateIndex=function(idx,max){var minBoundary=(that.autoSelectFirst===false)?-1:0;if(that.allowArrowCarousel){if(idx>max){return minBoundary}else{if(idx<minBoundary){return max}else{return idx}}}else{if(idx>max){return max}else{if(idx<minBoundary){that.responseContainer.scrollTop(0);return minBoundary}else{return idx}}}};var setActive=function(idx){if(that.selectedIndex!==undefined&&that.selectedIndex>-1){that.suggestionNodes[that.selectedIndex][0].removeClass("active")}that.selectedIndex=evaluateIndex(idx,that.suggestionNodes.length-1);if(that.selectedIndex>-1){that.suggestionNodes[that.selectedIndex][0].addClass("active")}};var evaluateIfActive=function(){return that.suggestionNodes&&that.suggestionNodes[that.selectedIndex]&&that.suggestionNodes[that.selectedIndex][0].hasClass("active")};var keyPressHandler=function(e){if(that.responseContainer.is(":visible")){if(e.keyCode===13){if(evaluateIfActive()&&!that.pendingRequest){that.completeField(that.suggestionNodes[that.selectedIndex][1])}e.preventDefault();e.stopPropagation()}}};var keyboardNavigateHandler=function(e){if(that.responseContainer.is(":visible")){if(that.field[0]!==document.activeElement){that.field.focus()}if(e.keyCode===40){setActive(that.selectedIndex+1);if(that.selectedIndex>=0){var containerHeight=that.responseContainer.height();var bottom=that.suggestionNodes[that.selectedIndex][0].position().top+that.suggestionNodes[that.selectedIndex][0].outerHeight();if(bottom-containerHeight>0){that.responseContainer.scrollTop(that.responseContainer.scrollTop()+bottom-containerHeight+2)}}else{that.responseContainer.scrollTop(0)}e.preventDefault()}else{if(e.keyCode===38){setActive(that.selectedIndex-1);if(that.selectedIndex>=0){var top=that.suggestionNodes[that.selectedIndex][0].position().top;if(top<0){that.responseContainer.scrollTop(that.responseContainer.scrollTop()+top-2)}}e.preventDefault()}else{if(e.keyCode===9){if(evaluateIfActive()){that.completeField(that.suggestionNodes[that.selectedIndex][1]);e.preventDefault()}else{that.dropdownController.hideDropdown()}}}}}};if(suggestionNodes.length){this.selectedIndex=0;this.suggestionNodes=suggestionNodes;for(var i=0;i<that.suggestionNodes.length;i++){var eventData={instance:this,index:i};this.suggestionNodes[i][0].bind("mouseover",eventData,activate).bind("mouseout",eventData,deactivate).bind("click",eventData,complete)}if(!this.keyboardHandlerBinded){jQuery(this.field).keypress(keyPressHandler);if(jQuery.browser.mozilla){jQuery(this.field).keypress(keyboardNavigateHandler)}else{jQuery(this.field).keydown(keyboardNavigateHandler)}this.keyboardHandlerBinded=true}if(that.autoSelectFirst===false){setActive(-1)}else{setActive(0)}inFocus=this}function activate(event){if(that.dropdownController.displayed){setActive(event.data.index)}}function deactivate(event){if(event.data.index===0){that.selectedIndex=-1}jQuery(this).removeClass("active")}function complete(event){that.completeField(that.suggestionNodes[event.data.index][1])}},clearResponseContainer:function(){this.responseContainer.empty();this.suggestionNodes=undefined},delay:delay,buildResponseContainer:function(){var inputParent=this.field.parent().addClass("atlassian-autocomplete");this.responseContainer=jQuery(document.createElement("div"));this.responseContainer.addClass("suggestions");this.positionResponseContainer();this.responseContainer.appendTo(inputParent)},positionResponseContainer:function(){this.responseContainer.css({top:this.field.outerHeight()})},keyUpHandler:(function(){var isIe8=jQuery.browser.msie&&jQuery.browser.version==8;function callback(){if(!this.responseContainer){this.buildResponseContainer()}this.dispatcher(this.field.val())}return function(e){if(this.field.val().length>=this.minQueryLength){if(!(e.keyCode in INVALID_KEYS)||(this.responseContainer&&!this.responseContainer.is(":visible")&&(e.keyCode==38||e.keyCode==40))){if(isIe8){delay(jQuery.proxy(callback,this),0.2)}else{callback.call(this)}}}return e}})(),addMultiSelectAdvice:function(delim){var that=this;var alertUserValueAlreadyExists=function(val){if(!alertUserValueAlreadyExists.isAlerting){alertUserValueAlreadyExists.isAlerting=true;var userAlert=jQuery(document.createElement("div")).css({"float":"left",display:"none"}).addClass("warningBox").html("Oops! You have already entered the value <em>"+val+"</em>").appendTo(that.field.parent()).show("fast",function(){that.delay(function(){userAlert.hide("fast",function(){userAlert.remove();alertUserValueAlreadyExists.isAlerting=false})},4)})}};jQuery.aop.before({target:this,method:"dispatcher"},function(innvocation){var val=this.field.val();innvocation[0]=jQuery.trim(val.slice(val.lastIndexOf(delim)+1));return innvocation});jQuery.aop.before({target:this,method:"completeField"},function(args){var valueToAdd=args[0],untrimmedVals=this.field.val().split(delim);var trimmedVals=jQuery(untrimmedVals).map(function(){return jQuery.trim(this)}).get();if(!this.allowDuplicates&&new RegExp("(?:^|[\\s"+delim+"])"+valueToAdd+"\\s*"+delim).test(this.field.val())){alertUserValueAlreadyExists(valueToAdd);trimmedVals[trimmedVals.length-1]=""}else{trimmedVals[trimmedVals.length-1]=valueToAdd;trimmedVals[trimmedVals.length]=""}args[0]=trimmedVals.join(delim.replace(/([^\s]$)/,"$1 "));return args})},addDropdownAdvice:function(){var that=this;jQuery.aop.after({target:this,method:"buildResponseContainer"},function(args){this.dropdownController=JIRA.Dropdown.AutoComplete({target:this,method:"renderSuggestions"},this.responseContainer);jQuery.aop.after({target:this.dropdownController,method:"hideDropdown"},function(){this.dropdown.removeClass("dropdown-ready")});return args});jQuery.aop.after({target:this,method:"renderSuggestions"},function(args){if(args&&args.length>0){this.dropdownController.displayDropdown();if(this.maxHeight&&this.dropdownController.dropdown.prop("scrollHeight")>this.maxHeight){this.dropdownController.dropdown.css({height:this.maxHeight,overflowX:"visible",overflowY:"scroll"})}else{if(this.maxHeight){this.dropdownController.dropdown.css({height:"",overflowX:"",overflowY:""})}}this.dropdownController.dropdown.addClass("dropdown-ready")}else{this.dropdownController.hideDropdown()}return args});jQuery.aop.after({target:this,method:"completeField"},function(args){this.dropdownController.hideDropdown();return args});jQuery.aop.after({target:this,method:"keyUpHandler"},function(e){if((!(this.field.val().length>=this.minQueryLength)||e.keyCode===27)&&this.dropdownController&&this.dropdownController.displayed){this.dropdownController.hideDropdown();if(e.keyCode===27){e.stopPropagation()}}return e})},init:function(options){var that=this;this.set(options);this.field=this.field||jQuery("#"+this.fieldID);this.field.attr("autocomplete","off").keyup(function(e){if(!that.disabled){that.keyUpHandler(e)}}).keydown(function(e){var ESC_KEY=27;if(e.keyCode===ESC_KEY&&that.responseContainer&&that.responseContainer.is(":visible")){e.preventDefault()}}).click(function(e){if(inFocus===that){e.stopPropagation()}}).blur(function(){if(that.pendingRequest){that.pendingRequest.abort()}});this.addDropdownAdvice();if(options.delimChar){this.addMultiSelectAdvice(options.delimChar)}}}}();AJS.namespace("jira.widget.autocomplete",null,JIRA.AutoComplete);
/* module-key = 'jira.webresources:autocomplete', location = '/includes/jira/autocomplete/RESTAutoComplete.js' */
JIRA.RESTAutoComplete=function(){var that=begetObject(JIRA.AutoComplete);that.dispatcher=function(reqFieldVal){var that=this;if(reqFieldVal.length<this.minQueryLength){return }if(!this.getSavedResponse(reqFieldVal)){this.delay(function(){var params=that.getAjaxParams();params.data.query=reqFieldVal;params.success=function(data){that.saveResponse(reqFieldVal,data);that.responseContainer.scrollTop(0);that.renderSuggestions(data)};that._makeRequest(params)},that.queryDelay)}else{that.renderSuggestions(that.getSavedResponse(reqFieldVal));that.responseContainer.scrollTop(0)}};that.getAjaxParams=function(){};that.getSavedResponse=function(val){if(!this.requested){this.requested={}}return this.requested[val]};that.saveResponse=function(val,response){if(typeof val==="string"&&typeof response==="object"){if(!this.requested){this.requested={}}this.requested[val]=response}};return that}();AJS.namespace("jira.widget.autocomplete.REST",null,JIRA.RESTAutoComplete);
/* module-key = 'jira.webresources:autocomplete', location = '/includes/jira/autocomplete/IssueAutoComplete.js' */
JIRA.IssueAutoComplete=function(options){var that=begetObject(JIRA.RESTAutoComplete);that.getAjaxParams=function(){return{url:contextPath+"/rest/api/1.0/issues/picker",data:options.ajaxData,dataType:"json",type:"GET"}};that.renderSuggestions=function(response){var resultsContainer,suggestionNodes=[];this.clearResponseContainer();if(response&&response.sections&&response.sections.length>0){resultsContainer=AJS.$("<ul/>").appendTo(this.responseContainer);AJS.$(response.sections).each(function(){var section=this;var subSection=AJS.$("<div/>").attr("id",options.fieldID+"_s_"+section.id).addClass("yag").text(section.label);if(section.sub){subSection.append(AJS.$("<span/>").addClass("yagt").text("("+section.sub+")"))}resultsContainer.append(AJS.$("<li/>").append(subSection).mouseover(function(){AJS.$(this).addClass("active")}).mouseout(function(){AJS.$(this).removeClass("active")}));if(section.msg){var msg=AJS.$("<div/>").attr("id",options.fieldID+"_i_"+section.id+"_n").addClass("yad").text(section.msg);resultsContainer.append(AJS.$("<li/>").append(msg).mouseover(function(){AJS.$(this).addClass("active")}).mouseout(function(){AJS.$(this).removeClass("active")}))}if(section.issues&&section.issues.length>0){AJS.$(section.issues).each(function(){var imgUrl;if(/^http/.test(this.img)){imgUrl=this.img}else{imgUrl=contextPath+this.img}var issueNode=AJS.$("<li/>").append(AJS.$("<div/>").attr("id",options.fieldID+"_i_"+section.id+"_"+this.key).addClass("yad").append(AJS.$("<table/>").addClass("yat").attr({cellpadding:"0",cellspacing:"0"}).append(AJS.$("<tr/>").append(AJS.$("<td/>").append(AJS.$("<img/>").attr("src",imgUrl))).append(AJS.$("<td/>").append(AJS.$("<div/>").addClass("yak").html(this.keyHtml))).append(AJS.$("<td/>").css("width","100%").html(this.summary)))));resultsContainer.append(issueNode);suggestionNodes.push([issueNode,this.key])})}});that.addSuggestionControls(suggestionNodes);return suggestionNodes}};options.minQueryLength=1;options.queryDelay=0.25;that.init(options);return that};JIRA.IssueAutoComplete.init=function(){AJS.$("fieldset.issue-picker-params").each(function(){var params=JIRA.parseOptionsFromFieldset(AJS.$(this)),$container=AJS.$("#"+params.fieldId+"-container").add("#"+params.fieldName+"_container");$container.find("a.popup-trigger").click(function(e){var url=contextPath+"/secure/popups/IssuePicker.jspa?";url+="currentIssue="+params.currentIssueKey+"&";url+="singleSelectOnly="+params.singleSelectOnly+"&";url+="showSubTasks="+params.showSubTasks+"&";url+="showSubTasksParent="+params.showSubTaskParent;if(params.currentProjectId&&params.currentProjectId!=""){url+="&selectedProjectId="+params.currentProjectId}JIRA.IssuePicker.callback=function(keysMap){var $formElement,keys=[];keysMap=JSON.parse(keysMap);if(params.fieldId&&keys){$formElement=AJS.$("#"+params.fieldId);if($formElement){AJS.$.each(keysMap,function(){keys.push(this.value)});$formElement.val(keys.join(", "))}}};var vWinUsers=window.open(url,"IssueSelectorPopup","status=no,resizable=yes,top=100,left=200,width=620,height=500,scrollbars=yes,resizable");vWinUsers.opener=self;vWinUsers.focus();e.preventDefault()});if(!params.fieldId){params.fieldId=params.fieldName}if(params.issuePickerEnabled===true){JIRA.IssueAutoComplete({fieldID:params.fieldId,delimChar:params.singleSelectOnly===true?undefined:",",ajaxData:params})}})};AJS.namespace("jira.widget.autocomplete.Issues",null,JIRA.IssueAutoComplete);
/* module-key = 'jira.webresources:autocomplete', location = '/includes/jira/autocomplete/UserAutoComplete.js' */
JIRA.UserAutoComplete=function(options){var that=begetObject(JIRA.RESTAutoComplete);that.getAjaxParams=function(){return{url:contextPath+"/rest/api/1.0/users/picker",data:{fieldName:options.fieldID},dataType:"json",type:"GET"}};function fieldsFormHasBeenSubmitted(field){var submitting=false,form=field.closest("form");if(form.length&&form.hasClass("submitting")){submitting=true}return submitting}that.renderSuggestions=function(response){if(fieldsFormHasBeenSubmitted(this.field)||!AJS.isSelenium()&&!AJS.elementIsFocused(this.field)){return false}var resultsContainer,suggestionNodes=[];this.clearResponseContainer();if(response&&response.users&&response.users.length>0){resultsContainer=jQuery("<ul/>").appendTo(this.responseContainer);jQuery(response.users).each(function(){suggestionNodes.push([jQuery("<li/>").html(this.html).appendTo(resultsContainer),this.name])})}if(response.footer){this.responseContainer.append(jQuery("<div/>").addClass("yui-ac-ft").html(response.footer).css("display","block"))}if(suggestionNodes.length>0){that.addSuggestionControls(suggestionNodes);AJS.$(".atlassian-autocomplete div.yad, .atlassian-autocomplete .labels li").textOverflow({autoUpdate:true})}return suggestionNodes};options.minQueryLength=2;options.queryDelay=0.25;that.init(options);return that};JIRA.UserAutoComplete.init=function(parent){AJS.$("fieldset.user-picker-params",parent).each(function(){var params=JIRA.parseOptionsFromFieldset(AJS.$(this)),field=(params.fieldId||params.fieldName),$container=AJS.$("#"+field+"_container");$container.find("a.popup-trigger").click(function(e){var url=contextPath,vWinUsers;e.preventDefault();if(!params.formName){params.formName=$container.find("#"+field).parents("form").attr("name")}if(params.actionToOpen){url=url+params.actionToOpen}else{url=url+"/secure/popups/UserPickerBrowser.jspa"}url+="?formName="+params.formName+"&";url+="multiSelect="+params.multiSelect+"&";url+="decorator=popup&";url+="element="+field;vWinUsers=window.open(url,"UserPicker","status=yes,resizable=yes,top=100,left=100,width=800,height=750,scrollbars=yes");vWinUsers.opener=self;vWinUsers.focus()});if(params.userPickerEnabled===true){JIRA.UserAutoComplete({field:parent?parent.find("#"+field):null,fieldID:field,delimChar:params.multiSelect===false?undefined:",",ajaxData:{fieldName:params.fieldName}})}})};AJS.namespace("jira.widget.autocomplete.Users",null,JIRA.UserAutoComplete);
/* module-key = 'jira.webresources:autocomplete', location = '/includes/jira/autocomplete/initAutoCompleteFields.js' */
JIRA.bind(JIRA.Events.NEW_CONTENT_ADDED,function(e,context,reason){if(reason!==JIRA.CONTENT_ADDED_REASON.panelRefreshed){JIRA.UserAutoComplete.init(context);JIRA.IssueAutoComplete.init(context)}});JIRA.bind(JIRA.Events.NEW_CONTENT_ADDED,function(e,context,reason){if(reason!==JIRA.CONTENT_ADDED_REASON.panelRefreshed){AJS.$("fieldset.user-searcher-params",context).each(function(){var params=JIRA.parseOptionsFromFieldset(AJS.$(this)),$container=AJS.$("#"+params.fieldId+"_container",context);if(params.userPickerEnabled===true){var autocompleter=JIRA.UserAutoComplete({fieldID:params.fieldId,delimChar:params.multiSelect===true?",":undefined,ajaxData:{fieldName:params.fieldName}})}var setupFields=function(related){var field=AJS.$("#"+params.fieldId,context);var userImage=AJS.$("#"+params.fieldId+"Image",context);var groupImage=AJS.$("#"+params.fieldId+"GroupImage",context);var fieldDesc=AJS.$("#"+params.fieldId+"_desc",context);if(related==="select.list.none"){field.val("").attr("disabled","true");userImage.hide();groupImage.hide();fieldDesc.hide()}else{field.removeAttr("disabled");if(related==="select.list.group"){userImage.hide();groupImage.show();if(params.userPickerEnabled===true){autocompleter.disable();fieldDesc.hide()}}else{userImage.show();groupImage.hide();if(params.userPickerEnabled===true){autocompleter.enable();fieldDesc.show()}}}};AJS.$("#"+params.userSelect,context).change(function(){var related=AJS.$(this).find("option:selected").attr("rel");setupFields(related)}).find("option:selected").each(function(){setupFields(AJS.$(this).attr("rel"))});$container.find("a.user-popup-trigger").click(function(e){var url=contextPath+"/secure/popups/UserPickerBrowser.jspa?";url+="formName="+params.formName+"&";url+="multiSelect="+params.multiSelect+"&";url+="decorator=popup&";url+="element="+params.fieldId;var vWinUsers=window.open(url,"UserPicker","status=yes,resizable=yes,top=100,left=100,width=800,height=750,scrollbars=yes");vWinUsers.opener=self;vWinUsers.focus();e.preventDefault()});$container.find("a.group-popup-trigger").click(function(e){var url=contextPath+"/secure/popups/GroupPickerBrowser.jspa?";url+="formName="+params.formName+"&";url+="multiSelect="+params.multiSelect+"&";url+="decorator=popup&";url+="element="+params.fieldId;var vWinUsers=window.open(url,"GroupPicker","status=yes,resizable=yes,top=100,left=100,width=800,height=750,scrollbars=yes");vWinUsers.opener=self;vWinUsers.focus();e.preventDefault()})})}});
