# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

	Node.create([{rid: 'Trento', name: 'Trento', jira_project_url: 'http://jira.fi-ware.org/browse/TREN', jira_project_id: 'TREN'},
	             {rid: 'Berlin', name: 'Berlin', jira_project_url: 'http://jira.fi-ware.org/browse/BEAR', jira_project_id: 'BEAR'},
	             {rid: 'Lannion', name: 'Lannion', jira_project_url: 'http://jira.fi-ware.org/browse/LAN', jira_project_id: 'LAN'},
	             {rid: 'Prague', name: 'Prague', jira_project_url: 'http://jira.fi-ware.org/browse/PRAG', jira_project_id: 'PRAG'},
	             {rid: 'Waterford', name: 'Waterford', jira_project_url: 'http://jira.fi-ware.org/browse/WAT', jira_project_id: 'WAT'},
	             {rid: 'Spain', name: 'Spain', jira_project_url: 'http://jira.fi-ware.org/browse/SEV', jira_project_id: 'SEV'},
		     {rid: 'Athens_Neuropublic', name: 'Athens_Neuropublic', jira_project_url: 'http://jira.fi-ware.org/browse/NEOR', jira_project_id: 'NEOR'},
	             {rid: 'ATHENS_UPRC', name: 'ATHENS_UPRC', jira_project_url: 'http://jira.fi-ware.org/browse/UPRC', jira_project_id: 'UPRC'},
	             {rid: 'Karlskrona', name: 'Karlskrona', jira_project_url: 'http://jira.fi-ware.org/browse/ASI', jira_project_id: 'ASI'},
	             {rid: 'NITOS-UTH', name: 'NITOS-UTH', jira_project_url: 'http://jira.fi-ware.org/browse/UTH', jira_project_id: 'UTH'}])
