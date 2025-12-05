"use client";
import { Mail16 } from "@frosted-ui/icons";
import { useIframeSdk } from "@whop/react";
import { Button, Text } from "@whop/react/components";

export default function MessageDeveloper({ 
	userId, 
	userAgent 
}: { 
	userId: string, 
	userAgent: string 
}) {
	const isMobile = userAgent && /Mobile|Android|iPhone|iPad|Tablet/i.test(userAgent);

	console.log("Is mobile:", isMobile);

	const iframeSdk = useIframeSdk();
	
	function openMessage() {
		iframeSdk.openExternalUrl({ 
			url: `https://whop.com/messages/?to_user_id=${userId}`, 
			newTab: isMobile ? false : true
		});
	}
	
	return (
		<Button onClick={() => openMessage()}>
			<Mail16 />
			<Text size="2">Message Developer</Text>
		</Button>
	);
}