export const habitatExplorerResourceUri = "ui://widget/habitat-explorer.v2.html";
export const habitatExplorerMimeType = "text/html;profile=mcp-app";
export const habitatExplorerWidgetDomain = "https://mcp.atlarium.bio";
const habitatExplorerResourceDomains = [
  "https://atlarium.bio",
  "https://mcp.atlarium.bio",
] as const;

export const habitatExplorerToolMeta = {
  ui: {
    resourceUri: habitatExplorerResourceUri,
  },
  "openai/outputTemplate": habitatExplorerResourceUri,
} satisfies Record<string, unknown>;

export const habitatExplorerResourceMeta = {
  title: "Atlarium Habitat Explorer",
  description:
    "Interactive read-only habitat cards for species, plants, compatibility and tank suggestions.",
  mimeType: habitatExplorerMimeType,
  _meta: {
    ui: {
      domain: habitatExplorerWidgetDomain,
      csp: {
        connectDomains: [],
        resourceDomains: [...habitatExplorerResourceDomains],
        frameDomains: [],
      },
      widgetDescription:
        "Render Atlarium habitat data as searchable cards, profile panels and compatibility summaries.",
    },
    "openai/widgetDescription":
      "Render Atlarium habitat data as searchable cards, profile panels and compatibility summaries.",
    "openai/widgetDomain": habitatExplorerWidgetDomain,
    "openai/widgetPrefersBorder": false,
    "openai/widgetCSP": {
      connect_domains: [],
      resource_domains: [...habitatExplorerResourceDomains],
      frame_domains: [],
    },
  },
};

const ATLARIUM_LOGO_DARK_JPEG =
  "data:image/jpeg;base64,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";
const ATLARIUM_LOGO_LIGHT_JPEG =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAgKADAAQAAAABAAAAgAAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8AAEQgAgACAAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/bAEMAAgICAgICBAICBAYEBAQGCAYGBgYICggICAgICgwKCgoKCgoMDAwMDAwMDA4ODg4ODhAQEBAQEhISEhISEhISEv/bAEMBAwMDBQQFCAQECBMNCw0TExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTE//dAAQACP/aAAwDAQACEQMRAD8A/fykpaTPOKAClpM84oz2oAWikzR2oAWikzVe7vLSwtJL+/lSCCFS8kkjBVVVGSzMeAAOpNAFmiq9pd2t/bR3tjIk0Myh0kRgysrDIKkZBBHQipwc0AFFGaM0ALRSE4ozjrQAUdqPejtQB//Q/fykzziigYBxQAZoyBRwKMDrQAV4d+0B4+1vwB4Jt7nwzKkGo6lqFtYwSyIJFTzX3SNsJAbEatxkVmfHL4ueI/hjf6HY6BZWlz/axuQ73kkkap9nRXCr5auSzAsen8NfGHx8/aMtfFmkeHdI8QaaNPvrbVorxWguEubd4kjkjdicJIhBkB+eMD3ry8dj4QjOjCVp20OPE4mMVKCep7rpf7WOo6Poc6+NtNW6vdhSyuNODGC5uG4ihljbMlu7tgZJZDzhu1eKfEj456z8ULuDwl4ptY9OgsYkmkso5fMhv7gE/vQ+BvtYsAiM8mQ/OMKM/Nk/ibStQ8W6U1hOs0NuJZcoeBKcRpn3XfuHuAas6haweN9Y/sd2aGx0mQST3CcSeYwx5EJ6Auv3ycgAA4ztr5etmWJqU/ZVpWVtXbU8ueLqTjytn0f8M/jpq3wvu7jwf4asxqsF7E80FiZRFHY3ORlzIciO1lznaMlXGEXDce+6h+1rZahoVu/gfS2udQaNftZvGMFrZzdJIXfaXlkRsgpEp92XNfntpdtD4M1c+H1ZpbTVHM1vcuf3jsnHkynpujBAXGAQdwGSaTTNfs08VarBPN5cUvl3C72+XzH+STbn+8yljjuaqlmuJp03TpO6S0fX+v8AIcMXUhHlTP1u+BvxD1f4keC5NW8QJAmoWd7c2VwLYMsRaGQhSocswBQqcEnrXseQOK/NT9nT9oHwl4R8La/Yw2t5q17PrdzcGG0RdkSMkaKXmlZIlDFCQNxPtX2L8Jfi9H8U5tWtjpc2mS6TJCjiWWKUP5yeYuGiZhkLjIzxkV9Xg8bCoo03JOdtUetQrxkoxb1PZiQKOOtGPWkwOtd50i570ZzRgGjtxQB//9H9/KSlpMd6ADHejHrRjuar3d1bWNpLfXjiOGFGkdj0VVGST9BQB8yftc+Eb3XPhS3inRlDX/heddViBwNyRBlmXn1iZjjuQBX5UXvjdbXxHp/iHSA+9UkgklUAYSZcgfMVyUYDPbHcdB9JfFX4n+K/jtrU13o5lXwzYytDBbwSPE12u7O90bgnAUksnyK20AvkrzNrpXh3RtSs9U0mRLSOWUJJHHiRvNxhg8x+cg9SSxyea/N89zqlUrP2Mb2Vr9z6rB8FU8RatjG030R5NceIvA3i11szZp/aUvDSW+y1uEwCS/mcRuoIx8wYE4FV/D+v2PhW4k8Ja4XgYyPNDPMoX7R5h5J2ll3jhTtYjAHNb3iW18PahrR1CxnMlzbzOt0Zgu3y5sgpu7AhsgfyzXL3OhXdlqEsAjia1EuRM4ztiGMoARzkAgg8HOc5xXlwxl1ytadvM6q3AOE9nywm1Lv/AJr/AIY6PUnTxpJ/YWkSCOO0ljmnvCCRCwBwsa8b5GUkYyAAck9K1o9A8G6FCjx6fHe3OQiTX2J5Xb+EBW/dryeipx615hpnjbRfD1tLoujzQPbxSsY5XkJLF8M2R95ipOzPcKK57WfGdnerI17dmMbSHl+62w8FYk6ruHBdgDjgDvXrUsNUq2jBO3br8z8oxdL6tVnRm9Ytq/Q9M0LXdOGpax4tnSKKMlI1EarGjxW4xuAUADe27bx056A1+o37JfhHUtA+Fg8R6/GYtQ8S3L6pKjDDIkoCwoR2xEqnHbOK/KjwDpWmeNrqBvEFyNF0+DDWIIiaOaaMhgsu87CMAHy2I8wAruGAD+tnwf8AjS3i/VG8CeLhaQa5Dbi5iazlD295bg7TJEMlo2Q4EkTElcggspzXs5HXw6rygn7233dL9z6DC5JiaFL61Wja/TrbufROM0YoxnrRjtX1pYYo7UY7UYxQB//S/fvNAznmlpOpoAQZzzXhP7TGuy6D8DfEU9nOsF1c2xtLYs23dNcMIkUYwSSW6CvdeTX5z/HXVL341yalf6Jum0vw2zppMaci71CBgZrkAfeWPaYIexYyEdq8rOcdDCYaUpPV6L1Z6WU4Z18RG+yabPjDWvEWj+E7qLT/AA+Z2bywojg+VsR8NuIIKgnLEgjJPPWvPb7Xp76wlOgZsri2n23WZGkxG67ldsb8MD1I9SCeM1m+JdTmm8RSeIJWWaO7iQw3Pll4WYY3KQVZQwG7G5SAxBxkceq/CTwl4A1j+0/EPxGvBoOn2dsjzXKSC1xLLI4Rdqjl5EUMYwpJIzt5NfCZLl/1qvGitW9r3s2tWnbXy01ufouf5i8BhZYnXlWjatdX0TV9HbfXoZV34D8c6h4etYJ9NvTbmNJlurNWkimUjduljAMo3ZySMkE5r0D4KfBHRfHen3msa6sksVldG2ESyM2Siqx3q33D8wwCCcdcHivbvhv8e/2a9Bt7HwVpPiK5H2UeVDdajbywROSSRmUoFUc4G4IoGOlcZ+1d4q+Ing7xj4cl8CeK30aw16N1eCB4441liKZumdFJdJFcZZieV444H6vlvDlPC4iLoxtf7Mlez8m1c/Cc24oxePwdShi5u6ek4NpuPaUU+W76nsy/s3/DLV08+00dDKvVMEE49K6zw18GPBelxGLTtIht5w20eYgYH6hs4r4s+Gn7Z/i7wnr/APYHxfmj13SxKYm1K3RVuYQDt8z5AqTx9yCofHIJ6H9IR4pJ0ee+s7qN/syJdQ3ikMJLYgNnceCu1gwb+71r3q8K1GXJJWPio4bDcqqNtrX8Ndujtt0PBPGH7MHhbVrWbWvCJHhbXFk3QeSd9pMWQjM8C/KOuBLGFYZz82K8u/ZnTxLoP7Sdl4N8f27Wms6fbXzyo53AxNHGFeOT+OJsZUj8cGvrTwF8WtK8VaPfap4QuIb63lDmKSACRYnUgupBGQpznBHHB6GuZ+M+radceB7D4+eFjEmteDJd8nlEETWvS6tmIJykke7A/hYDuK8DG5LSxFeGJqQtOL0a/J+X5P8AH7HJeJZ4ahLC06jcWtYv1tdea36XXnt9j6Pr+keIIWn0ecTIhwSAR15B5A4PY9DWzz0rzHw/rHwx8M6tD4Q0O4gtL7UkW5S23HzHVlJXqTj5VYquegOBgGvTs9qiokn7u3me9RlJxXO1frbYOQKO1HIo5xUGp//T/fsUnOaWkBz0oA+ff2m/FXiLwp8KLibwyTHPf3Vtp7Tq21oI7uQRPIpwcPhtqnHDEHtXyBc+KYLjTrLwboFgNKtJiljuS43mGBY2OxAI0IZ1QpvzkZJ+8Qa+1f2h7Sx1X4Pa7olxcRQXNxayNZiR1UyXMA8+JUyRlt0YIA5r8ytd1yb/AIRifxPpKkyLAuoQL6lAJwPxXI/GvzrjJ1XiKVOD0krLyf8ATPteG6dJ4edSotYu/wAv6RW+E3wk8N+Odd8Q+JLq7uNL8NafO1vB9mkEW6ZPmlkyQVCopVOMZJJJ4r1zTrD9krWbqHwpGNJvFhLAs1z59wxf78nmM4BkOBll5wABwBXwB46+IN9f+EdI+FGiytHpmnwJLfopwLu/uf38u/H3kjZ9oXoWBJ6DHMav4PSy8Yt4P0xzL5TRxsxAwGKrvxjsGJAr9pyXhehg6MOVWkklfq7db+Z+F59xRi8fUn7Wq+W7fLfRdlbyOr+Ifgjwvo/jzX7Twvcm50PS8OHBDEmTASENyC287c88AnnFaHwu+AGufFD4lWnwv0D/AEedIhcapdldyWcIIyqjuwJCBc4MhPQKTXofhLwHHNoGnQ6dbtLA2vhr3AJ/dWkLOu/0By3tk19h/sj22u6B8MPiF8TvDtvFe+IJJwY45gSJPJtUuVT5cN8xnbABGTivWzDGSo0nyPXa54+RUo4vE8tT4Um2vQ+lvB/7HX7OvhDRl0r/AIRq11OQrtludQUXM0h7sWfIXPogUDsK8Mvvgh8aPDVhqvwj8EabbzaHfme30/VJLpVSysbk5McsLfvWaAMVjCZDALkjmvS/C37XOl654UW+m0maTVTjbDbn/RXQjIlNw4Cxr2ZGBkB+6rggn5q8GeLviR4D8Qf2jaeIsmaeQvZ3C3V1bOrsz7HeSRcFQw2yRxqfl5BBxXztCjiVzNvXzPrMwxOXT9lFq6300t6/5H0H4s+AGs2fiXHwV1iy066m023sdRgvY5GBW3TyobuPyiP3wT5WU8MAuSMV53ofwQ+B8HiK0+HFnJrMGnxzR6bfCGeOOx1K+t497+fDlpVMmw+Y6BEdsqSep+lfhp8btB8YeID4d121g0/XGBjV4ZBNBOUUO0aS7VZZFU7jFIqtjldwBI6vxd4G0LRV1b4l+FdHiuPE0NrPNbH5j5lwIiEPl52b2wFLABiOM1g61SD9lUutNP67HbDB0aq+s0VF3d3p0Xl3+4+cX8caF4y+Jes6t4R8OLP4n0S3vFsUF25LS6exgQ3VoNiIxEjfZ2LEspIyuRj6i+FWt+M9e8IR6j47szZ3rSyqqtH5LvErERu8W+Ty2YdV3H14zgfnh4d8VeLviER4c+G2v3N/r2uwSjWBcuFjVY03jLRor2zFx5GAcYfAXIyPtP4A+DfGPhGw1R/E9lFpFvdyxG102Kbz1h2Jtkk3AlVMpwSqkjjPViKeMoqnGzaureb/AOGHlmJlWmpJOzvd2SV/Tv0ufQlHOOaTPc0vJFeae6f/1P3770ewozzRwOKAPiz9r/QdC8UTeE9E8QxefbeffXG3gkPDaMUYA8HaxBweD0PBr8+/iVYw+GtIew8ECa31GK2eS+tBI0lmbYqVVrdZNxTzRlkCsNm1lYZFfpn+1H4G8XeIfDFn4y8C4n1Dw600rWhQSfabeZNk6IDj94FGUwRnBA5Ir8w7vWH1q5k8SN5clx5KODArKklgFCOiqzM26JvnIJJyT/eIH51xJGrTxyqpaWTj5tbo+84fjCthPZt6ap+V9j5R8GaRDqHhjU9RkJeextY7iM56kyqrE+vyk16xp+raJc+INR1pYZZL9ruK6WVWzGICAzKVxnOe+a5bwlBb+G/G934TvGC2epRy2qOfu+Xcf6th7K+BVTwVdXXh7xFPa3MZLbJIJoz1wMq4/AZP4V/ROCxVPG4eGJou8ZJNfNH8xZtgqmFr1cLXVpRbT+R9o/DvxPpPgrxBq/g3WWKrfXkbQHsVuDtz9NpUmvavgNrPifwjH4m+HfhwJ/bGt6b9o0dZXEaNfWEf2K4QseAQEhlx3Uk9K+Pns/8AhPPB8Op6US+r6IgimUfflgX7jqO5X/PavYPCnimy8f6XHKt+2kaxbyRzpex432d/GvlpcgHgxTrhJVPGeG4bNefjcN7SDtv19V+jOTJsf9SxCrPbZnvngL9jLxpoXgxpbjxKdP112DpbRj7TYIuOUlVgrSOx5MilcdACOvzL4c8HfFLxZ8Q9Y8N+HdIW41CCaa3nuomZLRZIT5ZmEskYZBlcqhzuI4XBJr6Y8N/toeM/BmqjwN8d/C0o1JOIrzS2QxXij/lpHFMyZz1Ko7EH+EV6Vqf7WV1qduYfAnhi7WZuBcay8dpBH/tFEaWd8f3Vj59RXlQqYyLd43v9x91OllVWMJwnypfe/wCu5yGgeBPDnwY1fT/iV+0l4j06HVInkbTrS1Vkt0mZCJJiMGSZ1UnLFQsYOT2I9XufiD8UDqVj8OPCsmnX3ibUYjqM88m+Sy0+w+6kj7CrSPM/EaqVB+Y5Crk+SeDX8O61J4hvviHdyX2p61YS2dzrjosf2aKVGXyLSElhFEM/Kg3PI3zSE9vG5PiR4T+BVk1v4bubq8u0TfE1w/mX2o3EUXlQmYLgLDEnCIAERR6kmo+qVqsnzrXz2/ry+8tZnhcPCPsH7vZN382/8/kj1TxBoXj344abp3jTT9A0/U3sZtQ0vU9PEwgg+3W85h+2Rs+N6kIdpY+YgPy5Oa+4vAej6x4e8FaTofiK6+3X9naRQ3FxknzJEQBmyeTk9zyep5r4I/YO0v4oeKdGi8f+Mp3s9DsVuYNOs4mKpeXNxM0t3ezf89PnJSMn5Rzt6ZP6R8HrXn4uTT9j0ie7l9JNfWbO8kr3F680Dmjg0tcZ6R//1f37oAxRQBQAgwOTX5Bfta+DYfhP8U4tZ8KxJFZazE+ox2/TN6kgSeOIAYxMrqWToSWIxX6+4rzr4jfCfwF8WNNi03x1YLdi2Znt5QzRzQOwwWikQhlJ4zg4OOc15uaYBYyj7NaNNNP0PTyrMPqdb2j1i000fgz4p+F95qvg65+IFk8UclveNDHbu+2W3Q7THBj7jqyuD8rAg84IFeSS+I7mfV4tbAMeowEC4Dj7zpxuYf7Y4bseT3r9cPE37Bd9dXTR+FfGE0Wnl/NW2vrdZyJAuwMZEeLcQp2glc49a8s1/wD4Jw+M9YZZovFNgsyfdkFpKjY9DiVgR7EVvwrmGOyqbwmJhzUW9LPWPou3kcPF+T4HOI/XMNVtXW6adpLom7brv9/c+QdNv77SHj+IPgRibdOJ4fvGAn70cg6mM/wt6ehFej2//CKfEK5GteErsaJrvJeBzhJGPXHYhu+Ac91qp4v/AGXv2jvgbqTatptg+r2iDm70oGdWXuJbcjzAPUbWX3rxK98TeCtVmaHXbWTRtQB+c2/C7vVoJNrKf90/hX6hCtRr+/Sn/Xmj8QxmVVqErVINP+vvPp9PGHjjRNObwr8UvDyeIdG7KyeZsx3Rxu6dgcEdiBxUcGr/AAhcD+wtd8QeHsf8uzL9qjX2USrKQP8AgVfOcPxK1/w3DjRvE3nRL0RyxOP92RSB+BrufCeuftDfFKcWfgG1vtTYnHm21uscS/71wyrGv/fVZVacIe/NpfO34GVDDYmb5KUb+lz03VNR8K21m13c614j1OJR0Ih02FvrII1c/wDAea3fgP8AA3Vv2hdTN8unjQPAqSZupYi5n1JkP+qWeQmWRc/fkJ2jog3cj3b4S/sH3t/ew+K/2i9Q/tSZSHXS4JHeHPXE8xw0nuiBV9Swr9JbKxstNs4tP06FLe3gURxxRqFRFUYCqowAAOgFeBjs1ik6eH18/wDL/M+5ybhqcWq2OfpH/MZpelabomm2+j6RAltaWsaxQxRgKiIgwqqB0AAq/jNJj1pSK+ePtgwDQKPajHFAH//W/fvvQAc5pMkGjJzzQAuM9aOtJk0c0ALR7CkyaOaAFwe1c5rfg7wj4lGPEmlWeof9fMEcv/oamui5pM0J22E0nozzyx+D/wAJdLmFzp3hfSYJQch47KBWH0ITNegwwxwRrDAoRFGAqjAA9gKfzRyTTbb3BRS2QuPWjk0hzRk4pDFOTR7UmTRk9qAFxjgUopuTRk4oA//Z";

export function habitatExplorerHtml() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Atlarium Habitat Explorer</title>
  <style>
    :root {
      color-scheme: light dark;
      --deep-blue: #0a1628;
      --ocean: #0e4d92;
      --azure: #1a8fe3;
      --lagoon: #0b6fa8;
      --aqua: #64e8d6;
      --plant: #22a65e;
      --plant-deep: #0d5c3a;
      --paper: #f6f9fb;
      --surface: #f0f6fa;
      --surface-raised: #ffffff;
      --ink: #0b1a2e;
      --muted: #5a7188;
      --line: #c8d8e4;
      --foam: #e0eef6;
      --coral: #e85d3a;
      --amber: #d4952e;
      --bg: linear-gradient(135deg, #f7fbfd 0%, #e7f2f7 48%, #f3faf7 100%);
      --panel: rgb(255 255 255 / 0.72);
      --panel-solid: #ffffff;
      --tile: rgb(255 255 255 / 0.52);
      --tile-strong: rgb(232 244 251 / 0.76);
      --soft: rgb(26 143 227 / 0.1);
      --accent: var(--azure);
      --accent-ink: #ffffff;
      --water-bg: rgb(26 143 227 / 0.1);
      --water-line: rgb(26 143 227 / 0.38);
      --water-ink: #075d99;
      --plant-bg: rgb(34 166 94 / 0.1);
      --plant-line: rgb(34 166 94 / 0.38);
      --plant-ink: #0b7c43;
      --warn-bg: rgb(212 149 46 / 0.13);
      --warn-line: rgb(212 149 46 / 0.42);
      --warn-ink: #9c640f;
      --warn: var(--amber);
      --shadow: rgb(10 22 40 / 0.07);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --deep-blue: #060e1a;
        --ocean: #1565c0;
        --azure: #42a5f5;
        --lagoon: #4fc3f7;
        --aqua: #80ffea;
        --plant: #66d492;
        --plant-deep: #2e8b57;
        --paper: #0c1524;
        --surface: #111d30;
        --surface-raised: #142238;
        --ink: #e8f0f8;
        --muted: #8da4bd;
        --line: #1c2e42;
        --foam: #0f1e2f;
        --coral: #f08a70;
        --amber: #e2bd74;
        --bg: linear-gradient(135deg, #071525 0%, #0b1f32 48%, #071b22 100%);
        --panel: rgb(12 26 43 / 0.78);
        --panel-solid: #111d30;
        --tile: rgb(18 35 56 / 0.74);
        --tile-strong: rgb(19 48 62 / 0.84);
        --soft: rgb(100 232 214 / 0.11);
        --accent: var(--aqua);
        --accent-ink: #06101a;
        --water-bg: rgb(79 195 247 / 0.18);
        --water-line: rgb(79 195 247 / 0.38);
        --water-ink: #9be6ff;
        --plant-bg: rgb(102 212 146 / 0.17);
        --plant-line: rgb(102 212 146 / 0.36);
        --plant-ink: #a6f0c1;
        --warn-bg: rgb(226 189 116 / 0.18);
        --warn-line: rgb(226 189 116 / 0.36);
        --warn-ink: #ffd681;
        --warn: var(--amber);
        --shadow: rgb(0 0 0 / 0.2);
      }
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      background: var(--bg);
      color: var(--ink);
      font-size: 14px;
      line-height: 1.45;
      overflow-x: hidden;
    }

    button, input {
      font: inherit;
    }

    button {
      -webkit-tap-highlight-color: transparent;
    }

    .shell {
      min-height: 100vh;
      padding: 18px;
      display: grid;
      grid-template-rows: auto auto 1fr;
      gap: 14px;
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 2px 0;
    }

    .brand-lockup {
      display: flex;
      align-items: center;
      min-width: 0;
      gap: 10px;
    }

    .brand-logo-frame {
      width: 54px;
      height: 54px;
      flex: 0 0 auto;
      border-radius: 14px;
      overflow: hidden;
      background: transparent;
      box-shadow: none;
    }

    .brand-logo {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transform: scale(1.08);
    }

    .brand-logo.dark {
      display: none;
    }

    .brand-logo.light {
      mix-blend-mode: multiply;
    }

    @media (prefers-color-scheme: dark) {
      .brand-logo.light {
        display: none;
      }

      .brand-logo.dark {
        display: block;
        filter: saturate(1.08) contrast(1.04);
        mix-blend-mode: normal;
      }
    }

    .brand-copy {
      min-width: 0;
    }

    h1 {
      margin: 0;
      font-size: 20px;
      line-height: 1.15;
      letter-spacing: 0;
    }

    .status {
      color: var(--muted);
      font-size: 12px;
      margin-top: 3px;
    }

    .tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      justify-content: flex-end;
    }

    .tab, .action {
      border: 1px solid var(--line);
      border-radius: 999px;
      background: var(--tile);
      color: var(--ink);
      cursor: pointer;
      min-height: 32px;
      max-width: 100%;
      padding: 7px 11px;
      white-space: normal;
      transition: background 160ms ease, border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
    }

    .tab:hover, .action:hover {
      transform: translateY(-1px);
      border-color: var(--accent);
      box-shadow: 0 8px 18px var(--shadow);
    }

    .tab[aria-selected="true"], .action.primary {
      background: linear-gradient(135deg, var(--ocean), var(--azure));
      border-color: rgb(26 143 227 / 0.48);
      color: var(--accent-ink);
      box-shadow: 0 10px 22px rgb(26 143 227 / 0.16);
    }

    .action.primary {
      background: linear-gradient(135deg, var(--plant-deep), var(--plant));
      box-shadow: 0 10px 22px rgb(34 166 94 / 0.16);
    }

    .workspace {
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(260px, 0.9fr);
      gap: 12px;
      min-height: 0;
    }

    .pane {
      min-width: 0;
      overflow: hidden;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 18px 45px var(--shadow);
      backdrop-filter: blur(10px);
    }

    .controls {
      display: grid;
      grid-template-columns: minmax(220px, 1fr) auto;
      align-items: center;
      gap: 10px;
    }

    .filter {
      width: 100%;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--tile);
      color: var(--ink);
      min-height: 38px;
      padding: 8px 10px;
      outline: none;
      transition: border-color 160ms ease, box-shadow 160ms ease;
    }

    .filter:focus {
      border-color: var(--azure);
      box-shadow: 0 0 0 3px rgb(26 143 227 / 0.14);
    }

    .list {
      display: grid;
      gap: 8px;
      max-height: 56vh;
      overflow: auto;
      padding-right: 2px;
    }

    .item {
      width: 100%;
      min-width: 0;
      text-align: left;
      border: 1px solid var(--line);
      background: var(--tile);
      color: var(--ink);
      border-radius: 8px;
      padding: 11px;
      cursor: pointer;
      transition: border-color 160ms ease, background 160ms ease, box-shadow 160ms ease, transform 160ms ease;
    }

    .item:hover, .item.active {
      border-color: var(--accent);
      background: var(--tile-strong);
      box-shadow: 0 10px 24px var(--shadow);
    }

    .item:hover {
      transform: translateY(-1px);
    }

    .item.has-media {
      display: grid;
      grid-template-columns: 76px minmax(0, 1fr);
      align-items: center;
      gap: 10px;
      padding: 9px;
    }

    .item-copy {
      display: block;
      min-width: 0;
    }

    .thumb-frame, .mini-thumb {
      display: block;
      overflow: hidden;
      border: 1px solid var(--line);
      background: var(--soft);
    }

    .thumb-frame {
      width: 76px;
      aspect-ratio: 4 / 3;
      border-radius: 8px;
    }

    .mini-thumb {
      width: 58px;
      aspect-ratio: 1;
      border-radius: 8px;
    }

    .thumb-frame img, .mini-thumb img, .detail-media img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-title {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 10px;
      font-weight: 650;
      min-width: 0;
    }

    .latin {
      color: var(--muted);
      font-style: italic;
      font-size: 12px;
      text-align: right;
      min-width: 0;
      overflow-wrap: anywhere;
    }

    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
      min-width: 0;
    }

    .chip {
      border: 1px solid var(--line);
      border-radius: 999px;
      background: var(--tile);
      color: var(--muted);
      font-size: 11px;
      font-weight: 650;
      line-height: 1.2;
      padding: 3px 7px;
      max-width: 100%;
      overflow-wrap: anywhere;
    }

    .chip.water {
      background: var(--water-bg);
      border-color: var(--water-line);
      color: var(--water-ink);
    }

    .chip.plant {
      background: var(--plant-bg);
      border-color: var(--plant-line);
      color: var(--plant-ink);
    }

    .chip.warn {
      background: var(--warn-bg);
      border-color: var(--warn-line);
      color: var(--warn-ink);
    }

    .detail {
      min-height: 220px;
    }

    .detail-media {
      display: block;
      overflow: hidden;
      width: 100%;
      aspect-ratio: 16 / 9;
      max-height: 240px;
      margin-bottom: 12px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--soft);
    }

    .detail h2 {
      font-size: 18px;
      margin: 0 0 4px;
      letter-spacing: 0;
    }

    .summary {
      color: var(--muted);
      margin: 0 0 12px;
    }

    .body-copy {
      margin: 0;
      color: var(--ink);
    }

    .metrics {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
      margin: 12px 0;
    }

    .metric {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--tile);
      padding: 9px;
    }

    .metric strong {
      display: block;
      font-size: 12px;
      color: var(--muted);
      font-weight: 500;
    }

    .metric span {
      display: block;
      margin-top: 2px;
      font-weight: 650;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 0;
      min-width: 0;
    }

    .detail .actions {
      margin-top: 14px;
    }

    .section-title {
      margin: 16px 0 8px;
      color: var(--muted);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .stack {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }

    .mini-card {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--tile);
      padding: 9px;
    }

    .mini-card.profile-mini {
      display: grid;
      grid-template-columns: 58px minmax(0, 1fr);
      align-items: center;
      gap: 9px;
    }

    .mini-copy {
      display: block;
      min-width: 0;
    }

    .mini-card.warning {
      background: var(--warn-bg);
      border-color: var(--warn-line);
      color: var(--warn-ink);
    }

    .mini-card strong {
      display: block;
      margin-bottom: 2px;
      color: var(--ink);
    }

    .empty {
      color: var(--muted);
      border: 1px dashed var(--line);
      border-radius: 8px;
      padding: 18px;
      background: var(--tile);
    }

    .compat {
      border-left: 3px solid var(--accent);
      padding-left: 12px;
    }

    .warning {
      color: var(--warn-ink);
      margin: 0;
    }

    .disclaimer {
      margin-top: 14px;
      color: var(--muted);
      font-size: 12px;
    }

    @media (max-width: 720px) {
      .shell { padding: 12px; }
      .topbar { display: grid; }
      .tabs { justify-content: flex-start; }
      .controls { grid-template-columns: 1fr; }
      .workspace { grid-template-columns: 1fr; }
      .list { max-height: 42vh; }
      .metrics { grid-template-columns: 1fr; }
    }

    @media (max-width: 460px) {
      .topbar { gap: 12px; }
      .brand-logo-frame { width: 48px; height: 48px; border-radius: 12px; }
      h1 { font-size: 19px; }
      .tabs { gap: 5px; }
      .tab { padding: 7px 10px; }
      .controls .actions {
        display: grid;
        grid-template-columns: 1fr;
      }
      .controls .action {
        width: 100%;
      }
      .item-title {
        align-items: flex-start;
        flex-direction: column;
        gap: 2px;
      }
      .item.has-media {
        grid-template-columns: 64px minmax(0, 1fr);
      }
      .thumb-frame {
        width: 64px;
      }
      .latin {
        text-align: left;
      }
    }
  </style>
</head>
<body>
  <main class="shell">
    <header class="topbar">
      <div class="brand-lockup">
        <span class="brand-logo-frame" data-brand-logo role="img" aria-label="Atlarium logo">
          <img class="brand-logo light" src="${ATLARIUM_LOGO_LIGHT_JPEG}" alt="" />
          <img class="brand-logo dark" src="${ATLARIUM_LOGO_DARK_JPEG}" alt="" />
        </span>
        <div class="brand-copy">
          <h1>Atlarium Habitat Explorer</h1>
          <div class="status" id="status">Waiting for Atlarium tool data</div>
        </div>
      </div>
      <nav class="tabs" aria-label="Habitat views">
        <button class="tab" data-tab="results" aria-selected="true">Results</button>
        <button class="tab" data-tab="profile" aria-selected="false">Profile</button>
        <button class="tab" data-tab="compatibility" aria-selected="false">Compatibility</button>
        <button class="tab" data-tab="suggestions" aria-selected="false">Suggestions</button>
      </nav>
    </header>

    <section class="pane controls">
      <input id="filter" class="filter" type="search" placeholder="Filter visible habitat data" />
      <div class="actions">
        <button class="action primary" data-tool="suggest_species_for_tank">Suggest 90 L planted tank</button>
        <button class="action" data-tool="check_species_compatibility">Check community pair</button>
      </div>
    </section>

    <section class="workspace">
      <div class="pane">
        <div class="list" id="list"></div>
      </div>
      <aside class="pane detail" id="detail"></aside>
    </section>
  </main>

  <script>
    (() => {
      const state = {
        tab: "results",
        filter: "",
        selectedIndex: 0,
        tool: "",
        data: null,
        language: "en"
      };

      const tabs = Array.from(document.querySelectorAll(".tab"));
      const list = document.getElementById("list");
      const detail = document.getElementById("detail");
      const filter = document.getElementById("filter");
      const status = document.getElementById("status");
      const tabsNav = document.querySelector(".tabs");
      const isChatGptHost = new URLSearchParams(window.location.search).get("app") === "chatgpt";
      let rpcId = 1;
      let bridgeAttempts = 0;
      const atlariumImageHosts = ["atlarium.bio", "www.atlarium.bio", "mcp.atlarium.bio"];

      const uiCopy = {
        en: {
          aria: { views: "Habitat views" },
          tabs: {
            results: "Results",
            profile: "Profile",
            compatibility: "Compatibility",
            suggestions: "Suggestions"
          },
          status: {
            waiting: "Waiting for Atlarium data",
            showing: "Showing {tool}",
            requested: "Requested {tool} from the host",
            failed: "Tool call failed"
          },
          filter: { placeholder: "Filter visible habitat data" },
          actions: {
            suggestTank: "Suggest 90 L planted tank",
            checkPair: "Check community pair",
            waterParameters: "Water parameters",
            careGuides: "Care guides"
          },
          empty: {
            noData: "No visible habitat data yet. Run an Atlarium tool or clear the filter.",
            selectResult: "Select a result to inspect habitat details."
          },
          detail: {
            compatibilityReview: "Compatibility review",
            habitatItem: "Habitat item",
            structuredProfile: "Structured Atlarium profile",
            suggestedCandidate: "Suggested habitat candidate",
            compatibilityFallback: "Review overlapping care and water parameter constraints."
          },
          metrics: {
            tank: "Tank",
            temperature: "Temperature",
            care: "Care"
          },
          sections: {
            watchPoints: "Watch points",
            recommendedActions: "Recommended actions",
            speciesReviewed: "Species reviewed"
          },
          tools: {
            unknown: "Atlarium data",
            search_fish: "Fish search",
            get_fish_profile: "Fish profile",
            search_plants: "Plant search",
            get_plant_profile: "Plant profile",
            search_products: "Product search",
            get_product_profile: "Product profile",
            check_species_compatibility: "Compatibility review",
            get_water_parameters: "Water parameters",
            suggest_species_for_tank: "Tank suggestions",
            search_guides: "Care guides"
          },
          values: {
            beginner_friendly: "Beginner friendly",
            caution: "Caution",
            conditional_match: "Conditional match",
            compatibility_check: "Compatibility check",
            compatible_with_caution: "Compatible with caution",
            compatible: "Compatible",
            difficult: "Difficult",
            easy: "Easy",
            expert: "Expert",
            high: "High",
            intermediate: "Intermediate",
            low: "Low",
            medium: "Medium",
            moderate: "Moderate",
            needs_review: "Needs review",
            not_compatible: "Not compatible",
            not_recommended: "Not recommended",
            partial_match: "Partial match",
            recommended: "Recommended"
          },
          reasonLabels: {
            aggression: "Aggression",
            behavior: "Behavior",
            bioload: "Bioload",
            cover: "Cover",
            diet: "Diet",
            flow: "Flow",
            gh: "GH",
            kh: "KH",
            lighting: "Lighting",
            maintenance: "Maintenance",
            ph: "pH",
            planting: "Planting",
            stocking: "Stocking",
            substrate: "Substrate",
            tank_size: "Tank size",
            tank_volume: "Tank volume",
            temperature: "Temperature",
            temperament: "Temperament",
            water_match: "Water match"
          }
        },
        it: {
          aria: { views: "Viste habitat" },
          tabs: {
            results: "Risultati",
            profile: "Profilo",
            compatibility: "Compatibilità",
            suggestions: "Suggerimenti"
          },
          status: {
            waiting: "In attesa dei dati Atlarium",
            showing: "Vista: {tool}",
            requested: "Richiesta inviata: {tool}",
            failed: "Chiamata tool non riuscita"
          },
          filter: { placeholder: "Filtra i dati habitat visibili" },
          actions: {
            suggestTank: "Suggerisci vasca piantumata da 90 L",
            checkPair: "Controlla coppia di comunità",
            waterParameters: "Parametri acqua",
            careGuides: "Guide di cura"
          },
          empty: {
            noData: "Nessun dato habitat visibile. Avvia un tool Atlarium o svuota il filtro.",
            selectResult: "Seleziona un risultato per ispezionare i dettagli habitat."
          },
          detail: {
            compatibilityReview: "Analisi compatibilità",
            habitatItem: "Elemento habitat",
            structuredProfile: "Profilo Atlarium strutturato",
            suggestedCandidate: "Candidato habitat suggerito",
            compatibilityFallback: "Controlla la sovrapposizione tra cura e parametri dell'acqua."
          },
          metrics: {
            tank: "Vasca",
            temperature: "Temperatura",
            care: "Cura"
          },
          sections: {
            watchPoints: "Punti di attenzione",
            recommendedActions: "Azioni consigliate",
            speciesReviewed: "Specie analizzate"
          },
          tools: {
            unknown: "Dati Atlarium",
            search_fish: "Ricerca pesci",
            get_fish_profile: "Profilo pesce",
            search_plants: "Ricerca piante",
            get_plant_profile: "Profilo pianta",
            search_products: "Ricerca prodotti",
            get_product_profile: "Profilo prodotto",
            check_species_compatibility: "Analisi compatibilità",
            get_water_parameters: "Parametri acqua",
            suggest_species_for_tank: "Suggerimenti vasca",
            search_guides: "Guide di cura"
          },
          values: {
            beginner_friendly: "Adatto ai principianti",
            caution: "Attenzione",
            conditional_match: "Compatibile con condizioni",
            compatibility_check: "Controllo compatibilità",
            compatible_with_caution: "Compatibile con cautela",
            compatible: "Compatibile",
            difficult: "Difficile",
            easy: "Facile",
            expert: "Esperto",
            high: "Alto",
            intermediate: "Intermedio",
            low: "Basso",
            medium: "Medio",
            moderate: "Moderato",
            needs_review: "Da verificare",
            not_compatible: "Non compatibile",
            not_recommended: "Non consigliato",
            partial_match: "Compatibilità parziale",
            recommended: "Consigliato"
          },
          reasonLabels: {
            aggression: "Aggressività",
            behavior: "Comportamento",
            bioload: "Carico biologico",
            cover: "Ripari",
            diet: "Alimentazione",
            flow: "Movimento acqua",
            gh: "GH",
            kh: "KH",
            lighting: "Illuminazione",
            maintenance: "Manutenzione",
            ph: "pH",
            planting: "Piantumazione",
            stocking: "Popolazione",
            substrate: "Fondo",
            tank_size: "Vasca",
            tank_volume: "Volume vasca",
            temperature: "Temperatura",
            temperament: "Temperamento",
            water_match: "Parametri compatibili"
          }
        },
        es: {
          aria: { views: "Vistas de hábitat" },
          tabs: {
            results: "Resultados",
            profile: "Perfil",
            compatibility: "Compatibilidad",
            suggestions: "Sugerencias"
          },
          status: {
            waiting: "Esperando datos de Atlarium",
            showing: "Mostrando {tool}",
            requested: "Solicitud enviada: {tool}",
            failed: "Error al llamar la herramienta"
          },
          filter: { placeholder: "Filtra los datos de hábitat visibles" },
          actions: {
            suggestTank: "Sugerir acuario plantado de 90 L",
            checkPair: "Comprobar pareja comunitaria",
            waterParameters: "Parámetros del agua",
            careGuides: "Guías de cuidado"
          },
          empty: {
            noData: "Todavía no hay datos de hábitat visibles. Ejecuta una herramienta Atlarium o limpia el filtro.",
            selectResult: "Selecciona un resultado para revisar los detalles del hábitat."
          },
          detail: {
            compatibilityReview: "Revisión de compatibilidad",
            habitatItem: "Elemento de hábitat",
            structuredProfile: "Perfil estructurado de Atlarium",
            suggestedCandidate: "Candidato de hábitat sugerido",
            compatibilityFallback: "Revisa la superposición entre cuidados y parámetros del agua."
          },
          metrics: {
            tank: "Acuario",
            temperature: "Temperatura",
            care: "Cuidado"
          },
          sections: {
            watchPoints: "Puntos de atención",
            recommendedActions: "Acciones recomendadas",
            speciesReviewed: "Especies revisadas"
          },
          tools: {
            unknown: "Datos de Atlarium",
            search_fish: "Búsqueda de peces",
            get_fish_profile: "Perfil del pez",
            search_plants: "Búsqueda de plantas",
            get_plant_profile: "Perfil de planta",
            search_products: "Búsqueda de productos",
            get_product_profile: "Perfil de producto",
            check_species_compatibility: "Revisión de compatibilidad",
            get_water_parameters: "Parámetros del agua",
            suggest_species_for_tank: "Sugerencias de acuario",
            search_guides: "Guías de cuidado"
          },
          values: {
            beginner_friendly: "Apto para principiantes",
            caution: "Precaución",
            conditional_match: "Compatibilidad condicionada",
            compatibility_check: "Comprobación de compatibilidad",
            compatible_with_caution: "Compatible con cautela",
            compatible: "Compatible",
            difficult: "Difícil",
            easy: "Fácil",
            expert: "Experto",
            high: "Alto",
            intermediate: "Intermedio",
            low: "Bajo",
            medium: "Medio",
            moderate: "Moderado",
            needs_review: "Requiere revisión",
            not_compatible: "No compatible",
            not_recommended: "No recomendado",
            partial_match: "Compatibilidad parcial",
            recommended: "Recomendado"
          },
          reasonLabels: {
            aggression: "Agresividad",
            behavior: "Comportamiento",
            bioload: "Carga biológica",
            cover: "Refugios",
            diet: "Alimentación",
            flow: "Flujo",
            gh: "GH",
            kh: "KH",
            lighting: "Iluminación",
            maintenance: "Mantenimiento",
            ph: "pH",
            planting: "Plantación",
            stocking: "Población",
            substrate: "Sustrato",
            tank_size: "Acuario",
            tank_volume: "Volumen del acuario",
            temperature: "Temperatura",
            temperament: "Temperamento",
            water_match: "Parámetros compatibles"
          }
        }
      };
      state.language = detectLanguage();

      function bridge() {
        return window.openai;
      }

      function asObject(value) {
        return value && typeof value === "object" && !Array.isArray(value) ? value : {};
      }

      function detectLanguage(locale) {
        const host = bridge();
        const hostLocale = host && (host.locale || host.userLocale || host.language);
        const documentLocale = document.documentElement.lang;
        const candidate = String(locale || hostLocale || documentLocale || navigator.language || "en").toLowerCase();
        if (candidate.startsWith("it")) return "it";
        if (candidate.startsWith("es")) return "es";
        return "en";
      }

      function copy(path) {
        const parts = path.split(".");
        const localized = resolveCopy(uiCopy[state.language], parts);
        return localized ?? resolveCopy(uiCopy.en, parts) ?? path;
      }

      function resolveCopy(source, parts) {
        return parts.reduce((value, part) => {
          if (value && typeof value === "object" && part in value) return value[part];
          return undefined;
        }, source);
      }

      function formatMessage(path, values) {
        return copy(path).replace(/\\{(\\w+)\\}/g, (_, key) => values && key in values ? values[key] : "");
      }

      function toolLabel(name) {
        return copy("tools." + (name || "unknown"));
      }

      function valueLabel(value) {
        const key = String(value || "").toLowerCase().replaceAll(" ", "_");
        const translated = copy("values." + key);
        return translated.startsWith("values.") ? humanize(value) : translated;
      }

      function renderLocale() {
        document.documentElement.lang = state.language;
        if (tabsNav) tabsNav.setAttribute("aria-label", copy("aria.views"));
        filter.placeholder = copy("filter.placeholder");
        tabs.forEach((tab) => {
          tab.textContent = copy("tabs." + (tab.dataset.tab || "results"));
        });
        const suggestButton = document.querySelector('[data-tool="suggest_species_for_tank"]');
        const compatibilityButton = document.querySelector('[data-tool="check_species_compatibility"]');
        if (suggestButton) suggestButton.textContent = copy("actions.suggestTank");
        if (compatibilityButton) compatibilityButton.textContent = copy("actions.checkPair");
      }

      function parseContentText(content) {
        if (!Array.isArray(content)) return undefined;
        const textPart = content.find((entry) => entry && entry.type === "text" && typeof entry.text === "string");
        if (!textPart) return undefined;
        try {
          return JSON.parse(textPart.text);
        } catch {
          return undefined;
        }
      }

      function extractStructuredPayload(payload) {
        if (!payload || typeof payload !== "object") return payload;
        if ("structuredContent" in payload) return payload.structuredContent;
        if ("toolOutput" in payload) return extractStructuredPayload(payload.toolOutput);
        if ("mcp_tool_result" in payload) return extractStructuredPayload(payload.mcp_tool_result);
        if ("call_tool_result" in payload) return extractStructuredPayload(payload.call_tool_result);
        if ("toolResult" in payload) return extractStructuredPayload(payload.toolResult);
        if ("result" in payload) return extractStructuredPayload(payload.result);
        const parsedContent = parseContentText(payload.content);
        if (parsedContent !== undefined) return parsedContent;
        return payload;
      }

      function currentPayload(payload) {
        const extracted = extractStructuredPayload(payload);
        if (extracted && typeof extracted === "object" && "tool" in extracted && "data" in extracted) {
          return extracted;
        }
        return { tool: "unknown", data: extracted };
      }

      function receivePayload(payload) {
        if (payload === undefined || payload === null) return false;
        const normalized = currentPayload(payload);
        if (normalized.data === undefined || normalized.data === null) return false;
        const data = asObject(normalized.data);
        state.language = detectLanguage(normalized.language || normalized.locale || data.language || data.locale);
        state.tool = normalized.tool || "unknown";
        state.data = normalized.data ?? normalized;
        state.selectedIndex = 0;
        inferTab();
        render();
        return true;
      }

      function readBridgePayload() {
        const host = bridge();
        if (!host) return undefined;
        if (host.toolOutput !== undefined && host.toolOutput !== null) return host.toolOutput;
        if (host.toolResponseMetadata !== undefined && host.toolResponseMetadata !== null) {
          return host.toolResponseMetadata;
        }
        return undefined;
      }

      function hydrateFromBridge() {
        return receivePayload(readBridgePayload());
      }

      function inferTab() {
        if (/compatibility/i.test(state.tool)) state.tab = "compatibility";
        else if (/suggest/i.test(state.tool)) state.tab = "suggestions";
        else if (/profile|water/i.test(state.tool)) state.tab = "profile";
        else state.tab = "results";
      }

      function titleFor(item) {
        if (item.compatibility_level || Array.isArray(item.species_profiles)) return copy("detail.compatibilityReview");
        return item.common_name || item.name || item.title || item.slug || item.scientific_name || copy("detail.habitatItem");
      }

      function scientificFor(item) {
        if (Array.isArray(item.species_profiles)) {
          return item.species_profiles.map((species) => titleFor(asObject(species))).join(" + ");
        }
        return item.scientific_name || item.latin_name || "";
      }

      function safeImageUrl(value) {
        const text = String(value || "").trim();
        if (!text) return "";
        if (/^data:image\\/(png|jpe?g|webp|gif|avif);base64,/i.test(text)) return text;

        try {
          const url = text.startsWith("/")
            ? new URL(text, "https:" + "//atlarium.bio")
            : new URL(text);
          if (url.protocol === "https:" && atlariumImageHosts.includes(url.hostname)) {
            return url.href;
          }
        } catch {
          return "";
        }

        return "";
      }

      function imageFromCandidate(candidate) {
        if (!candidate) return "";
        if (typeof candidate === "string") return safeImageUrl(candidate);
        const item = asObject(candidate);
        for (const key of ["image_url", "imageUrl", "thumbnail_url", "thumbnailUrl", "thumbnailImage", "heroImage", "cover_image", "coverImage", "photo_url", "photoUrl", "src", "url"]) {
          const image = safeImageUrl(item[key]);
          if (image) return image;
        }
        return "";
      }

      function imageFor(item) {
        const source = asObject(item);
        for (const key of ["image_url", "imageUrl", "thumbnail_url", "thumbnailUrl", "thumbnailImage", "heroImage", "cover_image", "coverImage", "photo_url", "photoUrl", "image"]) {
          const image = imageFromCandidate(source[key]);
          if (image) return image;
        }
        for (const key of ["images", "media", "photos", "gallery_images", "galleryImages"]) {
          const values = Array.isArray(source[key]) ? source[key] : [];
          for (const candidate of values) {
            const image = imageFromCandidate(candidate);
            if (image) return image;
          }
        }
        return "";
      }

      function mediaFrame(image, alt, className) {
        if (!image) return "";
        return '<span class="' + className + '">' +
          '<img src="' + escapeHtml(image) + '" alt="' + escapeHtml(alt) + '" loading="lazy" decoding="async" referrerpolicy="no-referrer" />' +
          '</span>';
      }

      function allItems() {
        const data = state.data;
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (Array.isArray(data.results)) return data.results;
        if (Array.isArray(data.suggestions)) return data.suggestions;
        return [data];
      }

      function visibleItems() {
        const q = state.filter.trim().toLowerCase();
        const items = allItems().filter((item) => typeof item === "object" && item);
        if (!q) return items;
        return items.filter((item) => JSON.stringify(item).toLowerCase().includes(q));
      }

      function formatRange(range, unit) {
        if (!range || typeof range !== "object") return "";
        const min = range.min ?? range.minimum;
        const max = range.max ?? range.maximum;
        const suffix = range.unit || unit || "";
        if (min === undefined && max === undefined) return "";
        if (min !== undefined && max !== undefined) return min + "-" + max + (suffix ? " " + suffix : "");
        return String(min ?? max) + (suffix ? " " + suffix : "");
      }

      function rangeFor(item, key, unit) {
        const nested = asObject(item.water_parameters);
        return formatRange(item[key] || nested[key], unit);
      }

      function humanize(value) {
        return String(value || "").replaceAll("_", " ").replace(/\\b\\w/g, (letter) => letter.toUpperCase());
      }

      function chip(label, tone) {
        const className = tone ? "chip " + tone : "chip";
        return '<span class="' + className + '">' + escapeHtml(label) + '</span>';
      }

      function chipsFor(item) {
        const chips = [];
        const tank = item.min_tank_liters || item.minimum_tank_liters || item.tank_liters;
        const temp = rangeFor(item, "temperature_range", "C") || item.temperature;
        const ph = rangeFor(item, "ph_range") || item.ph;
        const gh = rangeFor(item, "gh_range");
        const care = item.care_level || item.difficulty || item.compatibility_level;
        if (tank) chips.push({ label: tank + " L", tone: "water" });
        if (temp) chips.push({ label: "Temp " + temp, tone: "water" });
        if (ph) chips.push({ label: "pH " + ph, tone: "water" });
        if (gh) chips.push({ label: "GH " + gh, tone: "water" });
        if (care) chips.push({ label: valueLabel(care), tone: "plant" });
        return chips;
      }

      function renderList() {
        const items = visibleItems();
        if (!items.length) {
          list.innerHTML = '<div class="empty">' + escapeHtml(copy("empty.noData")) + '</div>';
          return;
        }

        list.innerHTML = items.map((item, index) => {
          const chips = chipsFor(item).map((entry) => chip(entry.label, entry.tone)).join("");
          const image = imageFor(item);
          const title = titleFor(item);
          const className = ["item", image ? "has-media" : "", index === state.selectedIndex ? "active" : ""].filter(Boolean).join(" ");
          return '<button class="' + className + '" data-index="' + index + '">' +
            mediaFrame(image, title, "thumb-frame") +
            '<span class="item-copy">' +
            '<span class="item-title"><span>' + escapeHtml(title) + '</span><span class="latin">' + escapeHtml(scientificFor(item)) + '</span></span>' +
            '<span class="chips">' + chips + '</span></span>' +
            '</button>';
        }).join("");
      }

      function renderDetail() {
        const items = visibleItems();
        const item = asObject(items[state.selectedIndex] || state.data);
        if (!Object.keys(item).length) {
          detail.innerHTML = '<div class="empty">' + escapeHtml(copy("empty.selectResult")) + '</div>';
          return;
        }

        if (state.tab === "compatibility") {
          detail.innerHTML = renderCompatibility(item);
          return;
        }
        if (state.tab === "suggestions") {
          detail.innerHTML = renderSuggestion(item);
          return;
        }
        detail.innerHTML = renderProfile(item);
      }

      function renderProfile(item) {
        const summary = item.summary || item.description || item.short_description || item.care_summary || item.notes || "";
        const title = titleFor(item);
        return mediaFrame(imageFor(item), title, "detail-media") +
          '<h2>' + escapeHtml(title) + '</h2>' +
          '<p class="summary">' + escapeHtml(scientificFor(item) || item.slug || copy("detail.structuredProfile")) + '</p>' +
          (summary ? '<p class="body-copy">' + escapeHtml(summary) + '</p>' : "") +
          '<div class="metrics">' +
          metric(copy("metrics.tank"), item.min_tank_liters || item.minimum_tank_liters || item.tank_liters, "L") +
          metric(copy("metrics.temperature"), rangeFor(item, "temperature_range", "C") || item.temperature) +
          metric("pH", rangeFor(item, "ph_range") || item.ph) +
          metric("GH / KH", [rangeFor(item, "gh_range"), rangeFor(item, "kh_range")].filter(Boolean).join(" / ")) +
          metric(copy("metrics.care"), valueLabel(item.care_level || item.difficulty)) +
          '</div>' +
          '<div class="actions">' +
          actionButton("get_water_parameters", copy("actions.waterParameters")) +
          actionButton("search_guides", copy("actions.careGuides")) +
          '</div>';
      }

      function renderCompatibility(item) {
        const level = item.compatibility_level || item.level || "compatibility check";
        const summary = item.summary || item.explanation || item.message || "";
        const warnings = Array.isArray(item.warnings) ? item.warnings : [];
        const issues = Array.isArray(item.issues) ? item.issues : [];
        const actions = Array.isArray(item.recommended_actions) ? item.recommended_actions : [];
        const profiles = Array.isArray(item.species_profiles) ? item.species_profiles : [];
        const disclaimer = item.disclaimer || "";
        return '<div class="compat">' +
          '<h2>' + escapeHtml(valueLabel(level)) + '</h2>' +
          '<p class="summary">' + escapeHtml(summary || copy("detail.compatibilityFallback")) + '</p>' +
          renderNoticeList(copy("sections.watchPoints"), warnings.concat(issues), "warning") +
          renderNoticeList(copy("sections.recommendedActions"), actions, "") +
          renderSpeciesProfiles(profiles) +
          (disclaimer ? '<p class="disclaimer">' + escapeHtml(disclaimer) + '</p>' : "") +
          '</div>';
      }

      function renderSuggestion(item) {
        const reason = item.reason || item.rationale || item.summary || "";
        const reasonChips = reasonParts(reason).map((part) => chip(part, "plant")).join("");
        const title = titleFor(item);
        return mediaFrame(imageFor(item), title, "detail-media") +
          '<h2>' + escapeHtml(title) + '</h2>' +
          '<p class="summary">' + escapeHtml(scientificFor(item) || item.slug || copy("detail.suggestedCandidate")) + '</p>' +
          (reasonChips ? '<div class="chips">' + reasonChips + '</div>' : "") +
          '<div class="metrics">' +
          metric(copy("metrics.tank"), item.min_tank_liters || item.minimum_tank_liters || item.tank_liters, "L") +
          metric(copy("metrics.temperature"), rangeFor(item, "temperature_range", "C") || item.temperature) +
          metric("pH", rangeFor(item, "ph_range") || item.ph) +
          metric("GH / KH", [rangeFor(item, "gh_range"), rangeFor(item, "kh_range")].filter(Boolean).join(" / ")) +
          metric(copy("metrics.care"), valueLabel(item.care_level || item.difficulty || item.temperament)) +
          '</div>';
      }

      function reasonParts(reason) {
        return String(reason || "")
          .split(";")
          .map((part) => reasonPart(part))
          .filter(Boolean)
          .slice(0, 6);
      }

      function reasonPart(value) {
        const text = String(value || "").trim();
        const separator = text.indexOf(":");
        if (separator < 0) return humanize(text);
        const key = text.slice(0, separator).trim().toLowerCase().replaceAll(" ", "_");
        const label = copy("reasonLabels." + key);
        const readableKey = label.startsWith("reasonLabels.") ? humanize(key) : label;
        const detail = text.slice(separator + 1).trim();
        return detail ? readableKey + ": " + detail : readableKey;
      }

      function renderNoticeList(title, values, className) {
        if (!values.length) return "";
        return '<h3 class="section-title">' + escapeHtml(title) + '</h3>' +
          '<div class="stack">' +
          values.map((value) => '<div class="mini-card ' + className + '">' + escapeHtml(String(value)) + '</div>').join("") +
          '</div>';
      }

      function renderSpeciesProfiles(profiles) {
        if (!profiles.length) return "";
        return '<h3 class="section-title">' + escapeHtml(copy("sections.speciesReviewed")) + '</h3>' +
          '<div class="stack">' +
          profiles.map((profile) => {
            const item = asObject(profile);
            const chips = chipsFor(item).map((entry) => chip(entry.label, entry.tone)).join("");
            const image = imageFor(item);
            const title = titleFor(item);
            const className = image ? "mini-card profile-mini" : "mini-card";
            return '<div class="' + className + '">' +
              mediaFrame(image, title, "mini-thumb") +
              '<span class="mini-copy"><strong>' + escapeHtml(title) + '</strong>' +
              '<span class="summary">' + escapeHtml(scientificFor(item) || item.slug || "") + '</span>' +
              '<span class="chips">' + chips + '</span></span></div>';
          }).join("") +
          '</div>';
      }

      function metric(label, value, suffix) {
        if (value === undefined || value === null || value === "") return "";
        return '<div class="metric"><strong>' + escapeHtml(label) + '</strong><span>' + escapeHtml(String(value) + (suffix ? " " + suffix : "")) + '</span></div>';
      }

      function actionButton(tool, label) {
        return '<button class="action" data-tool="' + tool + '">' + escapeHtml(label) + '</button>';
      }

      function render() {
        renderLocale();
        tabs.forEach((tab) => tab.setAttribute("aria-selected", String(tab.dataset.tab === state.tab)));
        status.textContent = state.data
          ? formatMessage("status.showing", { tool: toolLabel(state.tool) })
          : copy("status.waiting");
        renderList();
        renderDetail();
      }

      function callTool(name) {
        const selected = asObject(visibleItems()[state.selectedIndex] || {});
        const slug = selected.slug || "aequidens-pulcher";
        const argsByTool = {
          get_water_parameters: { type: "fish", slug, language: state.language },
          search_guides: { query: selected.common_name || selected.name || slug, language: state.language, limit: 3 },
          suggest_species_for_tank: { tank_liters: 90, language: state.language, ph: 6.8, temperature: 24, planted_tank: true, beginner_friendly: true, limit: 5 },
          check_species_compatibility: { species: ["paracheirodon-innesi", "trigonostigma-heteromorpha"], language: state.language, tank_liters: 90, ph: 6.8, temperature: 24 }
        };
        const args = argsByTool[name] || {};

        const host = bridge();
        if (host && typeof host.callTool === "function") {
          host.callTool(name, args).then(receivePayload).catch((error) => {
            status.textContent = error && error.message ? error.message : copy("status.failed");
          });
          return;
        }

        window.parent.postMessage({
          jsonrpc: "2.0",
          id: rpcId++,
          method: "tools/call",
          params: { name, arguments: args }
        }, "*");
        status.textContent = formatMessage("status.requested", { tool: toolLabel(name) });
      }

      function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, (char) => ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        })[char]);
      }

      function samplePayload() {
        const samples = {
          en: {
            language: "en",
            tool: "search_fish",
            data: {
              results: [
                {
                  common_name: "Blue Acara",
                  scientific_name: "Andinoacara pulcher",
                  slug: "aequidens-pulcher",
                  min_tank_liters: 120,
                  temperature_range: { min: 22, max: 30, unit: "C" },
                  ph_range: { min: 6.5, max: 8 },
                  care_level: "moderate",
                  summary: "A resilient cichlid to evaluate with tank size, cover and community temperament in mind."
                },
                {
                  common_name: "Harlequin Rasbora",
                  scientific_name: "Trigonostigma heteromorpha",
                  slug: "trigonostigma-heteromorpha",
                  min_tank_liters: 60,
                  temperature_range: { min: 23, max: 28, unit: "C" },
                  ph_range: { min: 6, max: 7.5 },
                  care_level: "easy",
                  summary: "A peaceful schooling fish that prefers stable water and planted swimming space."
                },
                {
                  common_name: "Java Fern",
                  scientific_name: "Microsorum pteropus",
                  slug: "microsorum-pteropus",
                  min_tank_liters: 20,
                  temperature_range: { min: 20, max: 28, unit: "C" },
                  ph_range: { min: 6, max: 8 },
                  care_level: "beginner_friendly",
                  summary: "A hardy epiphyte for driftwood or rock layouts, useful for low-maintenance aquariums."
                }
              ]
            }
          },
          it: {
            language: "it",
            tool: "search_fish",
            data: {
              results: [
                {
                  common_name: "Acara blu",
                  scientific_name: "Andinoacara pulcher",
                  slug: "aequidens-pulcher",
                  min_tank_liters: 120,
                  temperature_range: { min: 22, max: 30, unit: "C" },
                  ph_range: { min: 6.5, max: 8 },
                  care_level: "moderate",
                  summary: "Un ciclide robusto da valutare considerando litraggio, ripari e temperamento in comunità."
                },
                {
                  common_name: "Rasbora arlecchino",
                  scientific_name: "Trigonostigma heteromorpha",
                  slug: "trigonostigma-heteromorpha",
                  min_tank_liters: 60,
                  temperature_range: { min: 23, max: 28, unit: "C" },
                  ph_range: { min: 6, max: 7.5 },
                  care_level: "easy",
                  summary: "Un pesce di branco pacifico che preferisce acqua stabile e spazio libero tra le piante."
                },
                {
                  common_name: "Felce di Giava",
                  scientific_name: "Microsorum pteropus",
                  slug: "microsorum-pteropus",
                  min_tank_liters: 20,
                  temperature_range: { min: 20, max: 28, unit: "C" },
                  ph_range: { min: 6, max: 8 },
                  care_level: "beginner_friendly",
                  summary: "Un'epifita resistente per legni o rocce, utile negli acquari a bassa manutenzione."
                }
              ]
            }
          },
          es: {
            language: "es",
            tool: "search_fish",
            data: {
              results: [
                {
                  common_name: "Acara azul",
                  scientific_name: "Andinoacara pulcher",
                  slug: "aequidens-pulcher",
                  min_tank_liters: 120,
                  temperature_range: { min: 22, max: 30, unit: "C" },
                  ph_range: { min: 6.5, max: 8 },
                  care_level: "moderate",
                  summary: "Un cíclido resistente que conviene evaluar por volumen, refugios y temperamento comunitario."
                },
                {
                  common_name: "Rasbora arlequín",
                  scientific_name: "Trigonostigma heteromorpha",
                  slug: "trigonostigma-heteromorpha",
                  min_tank_liters: 60,
                  temperature_range: { min: 23, max: 28, unit: "C" },
                  ph_range: { min: 6, max: 7.5 },
                  care_level: "easy",
                  summary: "Un pez de cardumen pacífico que prefiere agua estable y espacio entre plantas."
                },
                {
                  common_name: "Helecho de Java",
                  scientific_name: "Microsorum pteropus",
                  slug: "microsorum-pteropus",
                  min_tank_liters: 20,
                  temperature_range: { min: 20, max: 28, unit: "C" },
                  ph_range: { min: 6, max: 8 },
                  care_level: "beginner_friendly",
                  summary: "Una epífita resistente para troncos o rocas, útil en acuarios de bajo mantenimiento."
                }
              ]
            }
          }
        };
        return samples[state.language] || samples.en;
      }

      tabs.forEach((tab) => tab.addEventListener("click", () => {
        state.tab = tab.dataset.tab || "results";
        render();
      }));

      filter.addEventListener("input", () => {
        state.filter = filter.value;
        state.selectedIndex = 0;
        render();
      });

      document.addEventListener("click", (event) => {
        const item = event.target.closest("[data-index]");
        if (item) {
          state.selectedIndex = Number(item.dataset.index || 0);
          render();
          return;
        }
        const action = event.target.closest("[data-tool]");
        if (action) {
          callTool(action.dataset.tool);
        }
      });

      window.addEventListener("message", (event) => {
        if (event.source && event.source !== window.parent) return;
        const message = event.data;
        if (!message || typeof message !== "object") return;
        if (message.jsonrpc && message.jsonrpc !== "2.0") return;
        if (message.method === "ui/notifications/tool-result") {
          receivePayload(message.params);
          return;
        }
        if ("result" in message) {
          receivePayload(message.result);
        }
      }, { passive: true });

      window.addEventListener("openai:set_globals", (event) => {
        const globals = event.detail && event.detail.globals;
        if (!receivePayload(globals && globals.toolOutput)) {
          receivePayload(globals && globals.toolResponseMetadata);
        }
      }, { passive: true });

      function bootstrap() {
        if (hydrateFromBridge()) return;
        bridgeAttempts += 1;
        if (bridgeAttempts <= 20) {
          window.setTimeout(bootstrap, 100);
          return;
        }
        if (!isChatGptHost) {
          receivePayload(samplePayload());
          return;
        }
        render();
      }

      render();
      bootstrap();
    })();
  </script>
</body>
</html>`;
}
