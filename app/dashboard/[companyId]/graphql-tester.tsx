"use client";

import { Button, Card, IconButton, Text, TextArea, TextField, Tooltip } from "@whop/react/components";
import { sendRequest } from "@/lib/actions/send-request";
import { Checkmark20, Copy20, InfoCircle20, TelegramFilled20 } from "@frosted-ui/icons";
import { useState, useEffect } from "react";
import { parse, print } from "graphql";

export default function GraphQLTester() {
	const [response, setResponse] = useState<any>(null);
	const [endpoint, setEndpoint] = useState("");
	const [variables, setVariables] = useState("");
	const [variablesError, setVariablesError] = useState<string | null>(null);
	const [query, setQuery] = useState("");
	const [queryError, setQueryError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const [history, setHistory] = useState<Array<{endpoint: string, query: string, variables: string}>>([]);

	const formatJSON = () => {
		try {
			const parsed = JSON.parse(variables);
			setVariables(JSON.stringify(parsed, null, 4));
		} 
		catch (e) {}
	};

	const formatGraphQL = () => {
		try {
			const formatted = print(parse(query));
			setQuery(formatted);
			setQueryError(null);
		} 
		catch (e: any) {
			setQueryError(e.message);
		}
	};

	const validateGraphQL = (value: string) => {
		if (!value.trim()) {
			setQueryError(null);
			return true;
		}
		try {
			parse(value);
			setQueryError(null);
			return true;
		} catch (e: any) {
			setQueryError(e.message);
			return false;
		}
	};

	// Load from localStorage on mount
	useEffect(() => {
		const savedHistory = localStorage.getItem('graphql-tester-history');
		const savedState = localStorage.getItem('graphql-tester-state');
		
		if (savedHistory) {
			try {
				setHistory(JSON.parse(savedHistory));
			} catch (e) {}
		}
		
		if (savedState) {
			try {
				const { endpoint: savedEndpoint, query: savedQuery, variables: savedVariables } = JSON.parse(savedState);
				if (savedEndpoint) setEndpoint(savedEndpoint);
				if (savedQuery) setQuery(savedQuery);
				if (savedVariables) setVariables(savedVariables);
			} catch (e) {}
		}
	}, []);

	// Save history to localStorage whenever it changes
	useEffect(() => {
		if (history.length > 0) {
			localStorage.setItem('graphql-tester-history', JSON.stringify(history.slice(-20))); // Keep last 20
		}
	}, [history]);

	// Save current form state to localStorage
	useEffect(() => {
		const state = { endpoint, query, variables };
		localStorage.setItem('graphql-tester-state', JSON.stringify(state));
	}, [endpoint, query, variables]);

	const clearHistory = () => {
		setHistory([]);
		localStorage.removeItem('graphql-tester-history');
	};

	const validateJSON = (value: string) => {
		if (!value.trim()) {
			setVariablesError(null);
			return true;
		}
		try {
			JSON.parse(value);
			setVariablesError(null);
			return true;
		} catch (e: any) {
			setVariablesError(e.message);
			return false;
		}
	};

	const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value;
		setQuery(value);
		validateGraphQL(value);
	};

	const handleVariablesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value;
		setVariables(value);
		validateJSON(value);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!validateGraphQL(query) || !validateJSON(variables)) {
			return;
		}
		setIsLoading(true);
		const formData = new FormData(e.currentTarget);
		const response = await sendRequest(formData);

		// Add to history, keep last 20
		const newHistoryItem = {endpoint, query, variables};
		setHistory([newHistoryItem, ...history].slice(0, 20));
		setResponse(response);
		setIsLoading(false);
	};

	const [copied, setCopied] = useState(false);
	
	const copyRequest = () => {
		// Padding mostly messed up here because of the end-result formatting.
		const codeSnippet = `
const response = await fetch(\`https://whop.com/api/graphql/${endpoint}\`, {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		"Authorization": \`Bearer \${process.env.WHOP_API_KEY}\`,
	},
	body: JSON.stringify({
		query: \`
		${query.trim().split('\n').join('\n\t\t')}
		\`,
		variables: ${variables.split('\n').join('\n\t\t') || '{}'},
		operationName: "${endpoint}"
	})
}).then(res => res.json())`.trim();
		navigator.clipboard.writeText(codeSnippet);
		setCopied(true);
		setTimeout(() => setCopied(false), 750);
	};

	return (
		<>
			<div className="flex flex-row gap-4">
				<div className="w-1/2 flex flex-col gap-2">
					<Text size="4" weight="bold">Request</Text>
					<Card>
						<IconButton 
							variant="surface" 
							size="2" 
							color="gray" 
							onClick={copyRequest}
							className="absolute top-2 right-2"
						>
							{copied ? <Checkmark20 /> : <Copy20 />}
						</IconButton>
						<div className="flex flex-col gap-4">
							<form onSubmit={handleSubmit}>
								<div className="flex flex-col gap-4">
									<div className="flex flex-col gap-2">
										<label htmlFor="endpoint" className="flex flex-col items-start gap-2">
											<div className="flex flex-row gap-1 items-center">
												<Text size="4" weight="bold">Endpoint / Operation Name *</Text>
												<Tooltip
													content={
														<Text size="3">The endpoint and operation name to send the request to. This is the name of the endpoint in the GraphQL schema.</Text>
													}
												>
													<InfoCircle20 className="cursor-help"/>
												</Tooltip>
											</div>
											<Text size="2" color="gray">Full URL: https://whop.com/api/graphql/{"["}operation_name{"]"}</Text>
										</label>
										<TextField.Root>
											<TextField.Input
												name="endpoint" 
												placeholder="Endpoint / Operation Name"
												value={endpoint}
												onChange={(e) => setEndpoint(e.target.value)}
												required
											/>
										</TextField.Root>
									</div>

								<div className="flex flex-col gap-2">
									<div className="flex flex-row items-center gap-2">
										<label htmlFor="query">
											<Text size="4" weight="bold">GraphQL Query *</Text>
										</label>
										<Button variant="surface" size="2" color="gray" onClick={formatGraphQL} type="button">
											Format Query
										</Button>
									</div>
									<TextArea 
										name="query" 
										placeholder="Query" 
										rows={10}
										value={query}
										onChange={handleQueryChange}
										required
										style={{
											fontFamily: "monospace",
										}}
										spellCheck={false}
									/>
									{queryError && (
										<Text size="2" color="red" className="flex items-center gap-1">
											<InfoCircle20 />
											{queryError}
										</Text>
									)}
								</div>

								<div className="flex flex-col gap-2">
									<div className="flex flex-row items-center gap-2">
										<label htmlFor="variables">
											<Text size="4" weight="bold">Variables</Text>
										</label>
										<Button variant="surface" size="2" color="gray" onClick={formatJSON} type="button">
											Format JSON
										</Button>
									</div>
									<TextArea 
										name="variables" 
										placeholder='{"key": "value"}'
										rows={10}
										value={variables}
										onChange={handleVariablesChange}
										style={{
											fontFamily: "monospace",
										}}
										spellCheck={false}
									/>
									{variablesError && (
										<Text size="2" color="red" className="flex items-center gap-1">
											<InfoCircle20 />
											{variablesError}
										</Text>
									)}
								</div>

								<div className="flex flex-row gap-2 w-full">
									<Button 
										type="submit" 
										variant="classic" 
										size="2" 
										color="blue" 
										className="flex-1 gap-1"
										disabled={isLoading || !!variablesError || !!queryError}
										loading={isLoading}
									>
										{isLoading ? "Sending..." : "Send Request"}
										<TelegramFilled20 />
									</Button>
								</div>

								</div>
							</form>
						</div>
					</Card>
				</div>
				<div className="w-1/2 flex flex-col gap-2">
					<Text size="4" weight="bold">Response</Text>
					<JsonViewer data={response || {}} />
				</div>
			</div>
			<div className="flex flex-col gap-2">
				<div className="flex flex-row items-center gap-2">
					<Text size="4" weight="bold">History</Text>
					{ history.length > 0 && (
						<Button 
							variant="classic" 
							size="2" 
							color="red" 
							onClick={clearHistory} 
							type="button"
							className="ml-auto h-fit py-1"
						>
							<Text size="2" weight="bold">Clear History</Text>
						</Button>
					)}
				</div>
				<div className="flex flex-col gap-2">
					{history.map((item, index) => (
						<Card asChild key={index}>
							<Button 
								variant="surface"
								size="2"
								color="gray"
								onClick={() => {
									setEndpoint(item.endpoint);
									setQuery(item.query);
									setVariables(item.variables);
								}}
								className="h-fit"
								>
								<div className="flex flex-col gap-2">
									<Text size="3" weight="bold">/{item.endpoint}</Text>
									<Text size="3" className="line-clamp-1">{item.query}</Text>
									<Text size="3" className="line-clamp-1">{item.variables}</Text>
								</div>

							</Button>
						</Card>
					))}
				</div>
			</div>
		</>
		
	);
}

function JsonViewer({ data }: { data: any }) {
	const [copied, setCopied] = useState(false);
	
	const copyResponse = () => {
		navigator.clipboard.writeText(JSON.stringify(data, null, 2));
		setCopied(true);
		setTimeout(() => setCopied(false), 750);
	};
	
	return (
		<Card className="h-full">
			<IconButton 
				variant="surface" 
				size="2" 
				color="gray" 
				onClick={copyResponse}
				className="absolute top-2 right-2"
			>
				{copied ? <Checkmark20 /> : <Copy20 />}
			</IconButton>
			<pre className="overflow-x-auto h-full w-full">
				<code className="text-gray-10">{JSON.stringify(data, null, 4)}</code>
			</pre>
		</Card>
	);
}