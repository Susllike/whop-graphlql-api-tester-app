"use client";
import { Mail16 } from "@frosted-ui/icons";
import { useIframeSdk } from "@whop/react";
import { Button, IconButton, Text } from "@whop/react/components";

export default function MessageDeveloper({ 
	userId, 
	userAgent 
}: { 
	userId: string, 
	userAgent: string 
}) {
	const iframeSdk = useIframeSdk();
	
	const isMobile = userAgent && /Mobile|Android|iPhone|iPad|Tablet/i.test(userAgent);
	
	function openMessage() {
		iframeSdk.openExternalUrl({ 
			url: `https://whop.com/messages/?to_user_id=${userId}`, 
			newTab: isMobile ? false : true
		});
	}
	
	return (
		<>
			<Button className="hidden sm:flex" onClick={() => openMessage()}>
				<Mail16 />
				<Text size="2" >Message Developer</Text>
			</Button>
			<IconButton className="sm:hidden" onClick={() => openMessage()}>
				<Mail16 />
			</IconButton>
		</>
	);
}