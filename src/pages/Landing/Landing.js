import React from 'react';
import {
	Layout,
	Container
} from '../../styles/Form';
import { useHistory } from 'react-router-dom';

import styled from 'styled-components';

const Landing = () => {
	const history = useHistory();
	return (
		<Layout>
			<LandingContainer>
				<Title>💬 Chat-Chat-Chat</Title>
				<Subtitle left>Welcome to Chat-Chat-Chat<br/>a Chatting Application Made using React ❤️</Subtitle>
				<Subtitle left>Create your own public or private room!<br/>Or, you can join other rooms that are available!</Subtitle>
				<Subtitle left>Do you have an account?</Subtitle>
				<Subtitle blue right>
					<span onClick={() => history.push('/users/login')}>YES</span>
					<small>OR</small>
					<span onClick={() => history.push('/users/signup')}>NO</span>
				</Subtitle>
			</LandingContainer>
		</Layout>
	)
}

const LandingContainer = styled(Container)`
	width: 35%;
`
const Title = styled.h1`
	margin: 0 0 20px 0;
`

const Subtitle = styled.p`
	margin: 10px 0 0 0;
	background-color: ${props => props.blue ? 'lightblue' : 'lightsalmon'};
	color: white;
	border-radius: 6px;
	padding: 6px 12px;
	font-weight: 600;
	line-height: 1.5;
	margin-right: ${props => props.left ? 'auto' : '0'};
	margin-left: ${props => props.right ? 'auto' : '0'};
	& > span {
		font-size: 24px;
		cursor: pointer;
	}
	span {
		transition: all 0.3s cubic-bezier(.25,.8,.25,1);
		&:hover {
			color: black;
		}
	}
	small {
		font-size: 12px;
		margin: 0 24px;
	}
`


export default Landing