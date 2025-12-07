import { Avatar, Button, Dialog, Text } from "@whop/react/components";
import { headers } from "next/headers";
import { whopsdk } from "@/lib/whop-sdk";
import GraphQLTester from "./graphql-tester";
import MessageDeveloper from "./message-developer";
import { ExclamationTriangle20, Gear20, QuestionCircle20 } from "@frosted-ui/icons";

export default async function DashboardPage({
	params,
}: {
	params: Promise<{ companyId: string }>;
}) {
	const headersList = await headers();

	const { companyId } = await params;
	// Ensure the user is logged in on whop.
	const { userId } = await whopsdk.verifyUserToken(headersList);

	const userAgent = headersList.get('user-agent') ?? ""

	// Fetch the neccessary data we want from whop.
	const [company, user, access] = await Promise.all([
		whopsdk.companies.retrieve(companyId),
		whopsdk.users.retrieve(userId),
		whopsdk.users.checkAccess(companyId, { id: userId }),
	]);
	
	const displayName = user.name || `@${user.username}`;

	return (
		<div className="flex flex-col p-8 gap-4">
			<div className="flex flex-row gap-4 justify-between items-center">
				<div className="flex flex-row gap-2 items-center">
					<Avatar 
						size="2" 
						src={"/favicon.ico"} 
						fallback="GT" 
						variant="square"
					/>
					<Text size="6" weight="bold">GraphQL Tester</Text>
					<ExplainerButton />
					{/* <WarningButton /> */}
					{/* <SettingsButton /> */}
				</div>
				<MessageDeveloper userId="snnv" userAgent={userAgent} />
			</div>
			<GraphQLTester />
		</div>
	);
}


function ExplainerButton() {
	return (
		<Dialog.Root>
			<Dialog.Trigger>
				<Button variant="surface" size="2" color="gray" className="flex flex-row gap-1 items-center">
					<QuestionCircle20 />
					<Text size="2">What?</Text>
				</Button>
			</Dialog.Trigger>
			<Dialog.Content size="4">
				<section>
					<Dialog.Title className="mb-1">
						<Text>What is this?</Text>
					</Dialog.Title>
					<Dialog.Description>
						<Text>This is a tool that allows you to test your GraphQL queries against Whop's API and see the response.</Text>
					</Dialog.Description>					
				</section>
				<section>
					<Dialog.Title className="mb-1">
						<Text>Why is this?</Text>
					</Dialog.Title>
					<Dialog.Description>
						<Text>To make developers' lives easier. Maybe even yours!</Text>
					</Dialog.Description>
				</section>
				<section>
					<Dialog.Title className="mb-1">
						<Text>How do I use this?</Text>
					</Dialog.Title>
					<Dialog.Description className="flex flex-col gap-2">
						<Text>1. Enter the API key ( you can use the company API key or another app's if needed )<br /></Text>
						<Text>2. Enter the endpoint and operation name<br /></Text>
						<Text>3. Enter the GraphQL query ( you'll probably need to know the schema to do this. Up to you to figure it out. )<br /></Text>
						<Text>4. Enter the variables<br /></Text>
						<Text>5. Click "Send Request"<br /></Text>
						<Text>6. See the response in the response section<br /></Text>
						<Text>7. Repeat until desired outcome.<br /></Text>
					</Dialog.Description>
				</section>
				<Dialog.Close>
					<Button variant="surface" size="2" color="gray" className="flex flex-row gap-1 items-center w-full">
						<Text size="2">Close</Text>
					</Button>
				</Dialog.Close>
			</Dialog.Content>
		</Dialog.Root>
	);
}

function WarningButton() {
	return (
		<Dialog.Root>
			<Dialog.Trigger>
				<Button variant="soft" size="2" color="red" className="flex flex-row gap-1 items-center">
					<ExclamationTriangle20 />
					<Text size="2">Disclaimer</Text>
				</Button>
			</Dialog.Trigger>
			<Dialog.Content size="4" className="bg-red-3">
				<section>
					<Dialog.Title className="mb-1">
						<Text>Disclaimer</Text>
					</Dialog.Title>
					<Dialog.Description>
						<Text>This tool is provided as-is, without any warranty. Use at your own risk.</Text>
					</Dialog.Description>					
				</section>
				<Dialog.Close>
					<Button variant="soft" size="2" color="red" className="flex flex-row gap-1 items-center w-full">
						<Text size="2">Close</Text>
					</Button>
				</Dialog.Close>
			</Dialog.Content>
		</Dialog.Root>
	);
}

function SettingsButton() {
	return (
		<Dialog.Root>
			<Dialog.Trigger>
				<Button 
					variant="surface" 
					size="2" 
					color="gray" 
					className="flex flex-row gap-1 items-center"
				>
					<Gear20 />
					<Text size="2">Settings</Text>
				</Button>
			</Dialog.Trigger>
			<Dialog.Content size="4">
				<section>
					<Dialog.Title className="mb-1">
						<Text>Settings</Text>
					</Dialog.Title>
					<Dialog.Description>
						<Text>No settings yet. Maybe in the future.</Text>
					</Dialog.Description>					
				</section>
				<Dialog.Close>
					<Button variant="surface" size="2" color="gray" className="flex flex-row gap-1 items-center w-full">
						<Text size="2">Close</Text>
					</Button>
				</Dialog.Close>
			</Dialog.Content>
		</Dialog.Root>
	);
}