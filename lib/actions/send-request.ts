"use server";

import { headers } from "next/headers";
import { whopsdk } from "../whop-sdk";

export async function sendRequest(formData: FormData) {
	const headersList = await headers();

	// Ensure the user is logged in on whop.
	const { userId } = await whopsdk.verifyUserToken(headersList);

	const rawFormData = Object.fromEntries(formData);

	console.log("Raw form data:", rawFormData);

	const { query, endpoint, variables } = rawFormData;

	console.log("Query:", query);

	const response = await fetch(`https://whop.com/api/graphql/${endpoint}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${process.env.WHOP_API_KEY}`,
		},
		body: JSON.stringify({
			query: query,
			variables: variables && (variables as string).trim() ? JSON.parse(variables as string) : undefined,
			operationName: endpoint
		}),
	}).then(res => res.json()).catch(error => {
		console.error("Error:", error);
		return { error: error };
	});

	return response;
}