/*
 * View functions
 */
var tableStructure = {
	
	// Add column
	addColumn: function()
	{
		$('#columns').appendForm(baseUrl + '/schema/' + schema + '/tables/' + table + '/columnAction/create');
	},
	
	// Edit column
	editColumn: function(col)
	{
		$('#columns_' + col).appendForm(baseUrl + '/schema/' + schema + '/tables/' + table + '/columns/' + col + '/update');
	},
	
	// Drop column
	dropColumn: function(col)
	{
		$('#columns input[type="checkbox"]').attr('checked', false).change();
		$('#columns input[type="checkbox"][value="' + col + '"]').attr('checked', true).change();
		tableStructure.dropColumns();
	},
	dropColumns: function()
	{
		if($('#columns input[name="columns[]"]:checked').length > 0) 
		{
			$('#dropColumnsDialog').dialog("open");
		}
	},
	
	// Add index
	newIndexType: null,
	addIndex1: function(type, col)
	{
		$('#columns input[type="checkbox"]').attr('checked', false).change();
		$('#columns input[type="checkbox"][value="' + col + '"]').attr('checked', true).change();
		tableStructure.addIndex(type);
	},
	addIndex: function(type)
	{
		tableStructure.newIndexType = type;
		if($('#columns input[name="columns[]"]:checked').length > 0) 
		{
			// Set default name
			$('#newIndexName').val(tableStructure.getSelectedIds().join('_'));
			
			// Set title/text in dialog
			switch(type)
			{
				case 'primary':
					// No dialog needed when adding a primary key
					tableStructure.addIndexFinish();
					return;
				case 'fulltext':
					var dialogTitle = lang.get('database', 'addFulltextIndex');
					$('#addIndexDialog div').html(lang.get('database', 'enterNameForNewFulltextIndex'));
					break;
				case 'unique':
					var dialogTitle = lang.get('database', 'addUniqueKey');
					$('#addIndexDialog div').html(lang.get('database', 'enterNameForNewUniqueKey'));
					break;
				default:
					var dialogTitle = lang.get('database', 'addIndex');
					$('#addIndexDialog div').html(lang.get('database', 'enterNameForNewIndex'));
					break;
			}
			
			// Show dialog
			$('#addIndexDialog').dialog('option', 'title', dialogTitle).dialog('open');
		}
	},
	addIndexFinish: function()
	{
		// Collect ids
		var ids = tableStructure.getSelectedIds();
		
		// Do request
		$.post(baseUrl + '/schema/' + schema + '/tables/' + table + '/indexAction/createSimple', {
			index: $('#newIndexName').get(0).value,
			type: tableStructure.newIndexType,
			'columns[]': ids
		}, AjaxResponse.handle);	
	},
	addIndexForm: function()
	{
		$('#indices').appendForm(baseUrl + '/schema/' + schema + '/tables/' + table + '/indexAction/create');
	},
	
	// Edit index
	editIndex: function(index)
	{
		$('#indices_' + index).appendForm(baseUrl + '/schema/' + schema + '/tables/' + table + '/indices/' + index + '/update');
	},
	
	// Drop index
	dropIndexName: null,
	dropIndexType: null,
	dropIndex: function(name)
	{
		tableStructure.dropIndexName = name;
		tableStructure.dropIndexType = $('#indices_' + name).children('td:eq(1)').html().trim();
			
		// Set title/text in dialog
		switch(tableStructure.dropIndexType.toLowerCase())
		{
			case 'fulltext':
				var dialogTitle = lang.get('database', 'dropFulltextIndex');
				$('#dropIndexDialog').html(lang.get('database', 'doYouReallyWantToDropFulltextIndex', {'{index}' : name}));
				break;
			case 'unique':
				var dialogTitle = lang.get('database', 'dropUniqueKey');
				$('#dropIndexDialog').html(lang.get('database', 'doYouReallyWantToDropUniqueKey', {'{index}' : name}));
				break;
			default:
				var dialogTitle = lang.get('database', 'dropIndex');
				$('#dropIndexDialog').html(lang.get('database', 'doYouReallyWantToDropIndex', {'{index}' : name}));
				break;
		}
		
		$('#dropIndexDialog').dialog('option', 'title', dialogTitle);
		$('#dropIndexDialog').dialog('open');
	},
	
	// Get selected id's
	getSelectedIds: function()
	{
		var ids = [];
		$('#columns input[name="columns[]"]:checked').each(function() {
			ids.push($(this).val());
		});
		return ids;		
	},
	
	// Setup sortable
	setupSortable: function()
	{
		/*
		 * Setup sortable columns
		 */
		$('#columns tbody').sortable({
			handle: 'img.icon_arrow_move',
			update: function(event, ui) 
			{
				// Fix even/odd classes
				$('#columns tbody tr:even').addClass('even').removeClass('odd');
				$('#columns tbody tr:odd').addClass('odd').removeClass('even');
				
				// Get column id
				var id = ui.item[0].id.substr(8);
				
				// Get position & command
				var prevs = $('#columns_' + id).prevAll();
				if(prevs.length == 0)
				{
					var command = "FIRST";
				}
				else
				{
					var command = "AFTER " + $('#columns_' + id).prev()[0].id.substr(8); 
				}
				
				// Do AJAX request
				$.post(baseUrl + '/schema/' + schema + '/tables/' + table + '/columns/' + id + '/move', {
						command: command
					}, AjaxResponse.handle
				);
			}
		});
	},
	
	// Setup dialogs
	setupDialogs: function()
	{
		/*
		 * Setup drop column dialog
		 */
		$('div.ui-dialog>div[id="dropColumnsDialog"]').remove();
		$('#dropColumnsDialog').dialog({
			modal: true,
			resizable: false,
			autoOpen: false,
			buttons: {
				'No': function() 
				{
					$(this).dialog('close');
				},
				'Yes': function() 
				{
					
					// Collect ids
					var ids = tableStructure.getSelectedIds();
					
					// Do drop request
					$.post(baseUrl + '/schema/' + schema + '/tables/' + table + '/columnAction/drop', {
						'schema': schema,
						'table': table,
						'column[]': ids
					}, function(responseText) {
						AjaxResponse.handle(responseText);
						for(var i = 0; i < ids.length; i++)
						{
							$('#columns_' + ids[i]).remove();
						}
						$('#columns tr').removeClass('even').removeClass('odd');
						$('#columns tbody tr:even').addClass('even');
						$('#columns tbody tr:odd').addClass('odd');
					});
					
					$(this).dialog('close');
				}
			}		
		});
		
		/*
		 * Setup add index dialog
		 */
		$('div.ui-dialog>div[id="addIndexDialog"]').remove();
		$('#addIndexDialog').dialog({
			modal: true,
			resizable: false,
			autoOpen: false,
			dialogClass: 'addIndexDialog',
			buttons: {
				'Ok': function() 
				{
					tableStructure.addIndexFinish();	
					$(this).dialog('close');
				},
				'Cancel': function() 
				{
					$(this).dialog('close');
				}
			}		
		});
		
		/*
		 * Setup drop index dialog
		 */
		$('div.ui-dialog>div[id="dropIndexDialog"]').remove();
		console.profile();
		console.time('dialog');
		$('#dropIndexDialog').dialog({
			modal: true,
			resizable: false,
			autoOpen: false,
			buttons: {
				'Cancel': function() 
				{
					$(this).dialog('close');
				},
				'Ok': function() 
				{
					
					// Do request
					$.post(baseUrl + '/schema/' + schema + '/tables/' + table + '/indexAction/drop', {
						index: tableStructure.dropIndexName
					}, function(responseText) {
						var response = JSON.parse(responseText);
						AjaxResponse.handle(response);
						if(response.data.success)
						{
							$('#indices_' + tableStructure.dropIndexName).remove();
							$('#indices tr').removeClass('even').removeClass('odd');
							$('#indices tbody tr:even').addClass('even');
							$('#indices tbody tr:odd').addClass('odd');
						}
					});
					
					$(this).dialog('close');
				}
			}		
		});
		console.timeEnd('dialog');
		console.profileEnd();
	}
	
};