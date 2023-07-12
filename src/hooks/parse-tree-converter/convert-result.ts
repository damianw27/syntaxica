import { Node, Edge } from 'vis-network';

export interface ConvertResult {
  readonly nodes: Node[];
  readonly edges: Edge[];
}
