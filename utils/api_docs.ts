interface Endpoint {
  name: string;
  method: string;
  path: string;
  description: string;
  headers?: Record<string, string>;
  body?: any;
  queryParams?: Record<string, string>;
  responses: Record<string, string>;
}

interface EndpointCollection {
  endpoints: Record<string, Endpoint>;
}

interface APIInformation {
  PeopleAPI: EndpointCollection;
}

export const apiInformation: APIInformation = {
  PeopleAPI: {
    endpoints: {
      search: {
        name: "Search People",
        method: "POST",
        path: "/screener/person/search",
        description:
          "Allows querying Crustdata's People database for detailed professional information.",
        headers: {
          Authorization: "YOUR_SECRET_TOKEN",
          "Content-Type": "application/json",
        },
        body: {
          filters: [
            {
              filter_type: "COMPANY_HEADCOUNT",
              type: "in",
              value: ["5,001-10,000", "1-10", "11-50"],
            },
          ],
          page: 1,
        },
        responses: {
          "200": "A JSON response containing profiles and total profile count.",
          "400": "Bad request, check request body.",
        },
      },
      enrich: {
        name: "Enrich People Data",
        method: "GET",
        path: "/screener/person/enrich",
        description:
          "Enrich data for individuals using LinkedIn URLs or business emails.",
        queryParams: {
          linkedin_profile_url: "Comma-separated list of LinkedIn profile URLs",
          business_email: "Comma-separated list of business email addresses",
          real_time_search:
            "If set to True, performs a real-time search if data is not found in the database.",
        },
        responses: {
          "200": "Successful response with enriched data.",
          "400": "Bad request, check query parameters.",
        },
      },
      linkedin_posts: {
        name: "Retrieve LinkedIn Posts",
        method: "GET",
        path: "/screener/linkedin_posts",
        description:
          "Retrieves recent LinkedIn posts and engagement metrics for a specified person.",
        queryParams: {
          person_linkedin_url: "LinkedIn profile URL",
          company_domain: "LinkedIn company domain",
          page: "Page number for pagination",
        },
        responses: {
          "200": "A list of recent LinkedIn posts with engagement metrics.",
          "400": "Bad request, check query parameters.",
        },
      },
    },
  },
};

export function getNameDescription(): Array<{ name: string; description: string }> {
  return Object.values(apiInformation.PeopleAPI.endpoints).map((endpoint) => ({
    name: endpoint.name,
    description: endpoint.description,
  }));
}

export function getApiInformation(apiName: string): Endpoint | undefined {
  for (const endpointKey in apiInformation.PeopleAPI.endpoints) {
    if (apiInformation.PeopleAPI.endpoints[endpointKey].name === apiName) {
      return apiInformation.PeopleAPI.endpoints[endpointKey];
    }
  }
  return undefined;
}
