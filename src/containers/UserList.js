import React, { Component } from 'react';
import {
  fetchUsersIfNeeded,
  fetchRolesIfNeeded,
  setMembershipPaid,
  toggleUserRole,
  fetchPermissions
} from '../actions/users'
import { connect } from 'react-redux'
import UserTable from '../components/UserTable'
import { Loading } from '../components/Utilities';

class UserList extends Component
{
	componentDidMount() {
		this.props.fetchUsersIfNeeded(this.props.page)
		this.props.fetchRolesIfNeeded()
		this.props.fetchPermissions()
	}

	componentDidUpdate(prevProps) {
		if (this.props.page !== prevProps.page) {
			this.props.fetchUsersIfNeeded(this.props.page)
		}
	}

	render() {
		const { users, roles, page, lastPage, setMembershipPaid, toggleUserRole, permissions } = this.props;
		if (!users || !roles || !permissions) 
			return <Loading />;
		if (!permissions['users:list'] || !permissions['roles:assignRole:instructor'])
			throw new Error('Insufficient permissions');
		return (<UserTable users={users} roles={roles} page={page} lastPage={lastPage} setMembershipPaid={setMembershipPaid} toggleUserRole={toggleUserRole} />)
	}
}

function mapStateToProps(state, ownProps) {
	const { users, roles, permissions } = state;
	const page = parseInt(ownProps.match.params.page || 1);
	const userIds = users.usersByPage[page];
	const usersOnCurrentPage = userIds ? userIds.map(userId => users.usersById[userId]) : [];

	return { 
		users: usersOnCurrentPage, 
		page: page,
		lastPage: users.lastPage,
		roles: roles,
		permissions: permissions }
}

const actionCreators = {
	fetchUsersIfNeeded,
	fetchRolesIfNeeded,
	setMembershipPaid,
	toggleUserRole,
	fetchPermissions
}

export default connect(mapStateToProps, actionCreators)(UserList);