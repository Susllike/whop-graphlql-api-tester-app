import { Card, Text } from "@whop/react/components";

interface TrackingLink {
	id: string,
	name: string,
	route: string,
	clicks: number,
	conversionRate: number,
	convertedUsers: number,
	createdAt: number,
	fullUrl: string,
	revenueGenerated: number,
	destination: string,
	accessPass: {
		title: string,
	},
	plan: {
		formattedPrice: string,
	},
}

export function TrackingLinks({ 
	trackingLinks 
}: { 
	trackingLinks: TrackingLink[] 
}) {
	return (
		<>
			{trackingLinks.map((trackingLink) => (
				<Card key={trackingLink.id}>
					<div className="flex flex-col gap-4">
						<Text size="5" weight="bold">{trackingLink.name}</Text>
						<Text size="3">Route: {trackingLink.route}</Text>
						<Text size="3">{trackingLink.clicks} clicks</Text>
						<Text size="3">{trackingLink.conversionRate.toFixed(2)}% conversion rate</Text>
						<Text size="3">{trackingLink.convertedUsers} converted users</Text>
						<Text size="3">{new Date(trackingLink.createdAt * 1000).toLocaleDateString()}</Text>
						<Text size="3">{trackingLink.fullUrl}</Text>
						<Text size="3">${trackingLink.revenueGenerated.toFixed(2)}</Text>
						<Text size="3">{trackingLink.destination}</Text>
						<Text size="3">{trackingLink.accessPass.title}</Text>
						<Text size="3">${trackingLink.plan.formattedPrice}</Text>
					</div>
				</Card>
			))}
		</>
	);
}