import { SuggestionCluster } from "api/types/engine.types";
import { ExistingContent, Faq } from "types";

export interface ClusterItem {
    name: string;
    impressions: number;
    clicks: number;
    position: number;

}


export interface Cluster {
    clusterName: string;
    clusterItems: ClusterItem[];
}


export const createCluster = (data: Faq[] | ExistingContent[], cluster: SuggestionCluster) => {
    /**
     * Create a perfect object from the data
     */

    let clusterObject = {
        clusterName: cluster.name,
        suggestionId: null as number | null,
        clusterTotals: {
            impressions: 0,
            clicks: 0,
            position: 0
        },
        clusterItems: [] as ClusterItem[]
    }

    data.forEach((item) => {
        if ("question" in item && cluster.cluster.includes(item.question)) {
            clusterObject.clusterItems.push({
                name: item.question,
                impressions: item.impressions,
                clicks: item.clicks,
                position: item.position
            });
            clusterObject.suggestionId = item.id;
            clusterObject.clusterTotals.impressions += item.impressions;
            clusterObject.clusterTotals.clicks += item.clicks;
            clusterObject.clusterTotals.position += item.position;
        }
    })

    return clusterObject;
};

export const createClusters = (data: Faq[] | ExistingContent[], clusters: SuggestionCluster[]) => {
    return clusters.map((cluster) => createCluster(data, cluster))
}
