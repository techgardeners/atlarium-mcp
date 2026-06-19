from agents import Agent, Runner
from agents.mcp import MCPServerStreamableHttp


async def main() -> None:
    async with MCPServerStreamableHttp(
        name="Atlarium Habitat Database MCP",
        params={"url": "https://mcp.atlarium.bio/mcp", "timeout": 10},
        cache_tools_list=True,
    ) as atlarium:
        agent = Agent(
            name="Habitat planner",
            instructions=(
                "Use Atlarium for public habitat data. Treat compatibility "
                "and tank suggestions as advisory, not final husbandry advice."
            ),
            mcp_servers=[atlarium],
        )
        result = await Runner.run(
            agent,
            "Suggest peaceful freshwater species for a 90 liter planted tank at 24 C and pH 6.8.",
        )
        print(result.final_output)


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
