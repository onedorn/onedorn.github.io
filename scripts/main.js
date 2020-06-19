(function () {

	var FILTER_LIST_SELECTOR = '.filter';
	var ACTIVE_FILTER_SELECTOR = '.active';
	
	function Gallery(requireFilter, requireWorks, worksList) {
		this.requireFilter = requireFilter;
		this.requireWorks = requireWorks;
		this.worksList = worksList; 

		this.visibleWorksId = []; 
		this.hiddenWorksId = []; 
		this.allTags = [];
		
		this._buildFilerAndWorkHTML(this.requireFilter, this.requireWorks, this.worksList);

		this.updateModel("All"); 
		this.updateView(this.visibleWorksId, this.hiddenWorksId);
		this.requireFilter.find(FILTER_LIST_SELECTOR).on('click', 'a', this.clickHandler.bind(this)); // view
	}


	Gallery.prototype.clickHandler = function (event) { // presenter
		var $previousElement = this.requireFilter.find(ACTIVE_FILTER_SELECTOR);
		$previousElement.toggleClass("active");
		$(event.target).parent().toggleClass("active");

		this.updateModel(event.target.id);
		this.updateView(this.visibleWorksId, this.hiddenWorksId);
	};

	Gallery.prototype.updateView = function (toShow, toHide) { // view
		_.each(toShow, function(value) {
			$('#' + value).fadeIn("fast");
		});
		_.each(toHide, function(value) {
			$('#' + value).fadeOut("fast");
		});		
	};
	
	Gallery.prototype.updateModel = function (tag) { // model
		var _this = this;
		_this.visibleWorksId = [];
		_this.hiddenWorksId = [];

		if (tag == "All") {
			_this._showAllModel(_this.worksList);
			return;
		}

		_.each(_this.allTags, function (arr, index) {
			if (_.contains(arr, tag)) {
				_this.visibleWorksId.push(index);
			} else {
				_this.hiddenWorksId.push(index);
			}
		});
	};		

	Gallery.prototype._showAllModel = function (worksList) {
		var _this = this;
		_.each(worksList, function(value, i) {
			_this.visibleWorksId.push(i);
		});
	};	


	Gallery.prototype._buildFilerAndWorkHTML = function ($filterTargetNode, $worksTargetNode, worksList) {
		var _this = this;
	
		_.each(worksList, function(value, i) {
			$worksTargetNode.append(_this._buildSingleWorkHTML(value, i));
			_this.allTags.push(value.tags);
		});

		var uniqTags = _.uniq(_.flatten(_this.allTags));
		uniqTags.unshift("All"); 
		$filterTargetNode.append(_this._buldFilterHTML(uniqTags));
	};

	Gallery.prototype._buldFilterHTML = function (tags) {
		var $filterHolder = $('<ul class="filter" ></ul>');
		_.each(tags, function(value, index) {
			var active = (value === 'All') ? 'active' : undefined;
			var $filter = $('<li class=" ' + active + ' " >' +
	              				'<a id="' + value + '" '+ 
	              				    'class="name hvr-back-pulse" '+
	              					'href="#/'+value+'">' +value+'</a>' +
	            			'</li>');			
			$filterHolder.append($filter);
		});
		return $filterHolder;
	};	

	Gallery.prototype._buildSingleWorkHTML = function (singleWorkObj, id) {
		var $workWrapper = $('<div class="item-wrapper" id="'+ id + '"></div>');

		var $imgContainer = $('<div class="view view-first img-div">'  +
								'<img src="'+ singleWorkObj.image + '" alt="">' +
								'<div class="mask">'  +
									'<p>'+ singleWorkObj.description +'</p>' +
									'<a href="'+ singleWorkObj.linkToDemo +'" class="info">Demo</a>'  +
									'<a href="'+ singleWorkObj.linkToCode + '" class="info">Code</a>' +
								'</div>' +
							'</div>');
		var $descripContainer = $('<div class="description">' +
						            	'<a href="' + singleWorkObj.linkToDemo + '">'+
						            		'<h5>' + singleWorkObj.title + '</h5>'+
						           		'</a>' +
						            '</div>');
		var $tagsContainer = $('<div class="tags">' +
						            '<i class="fa fa-tag"></i>' +
						        '</div>');

		_.each(singleWorkObj.tags, function(value, index, list) {
			$singleTag = $('<span>' + value + '</span>');
			$tagsContainer.append($singleTag);
			if (_.last(list) !== value) {
				$separator = $('<i> | </i>');
				$tagsContainer.append($separator);
			}
		});

		$descripContainer.append($tagsContainer);
		$workWrapper.append($imgContainer);
		$workWrapper.append($descripContainer);
		return $workWrapper;
	};

	window.gallery1 = new Gallery($(".require-filter"), $(".require-works"), data);
}());