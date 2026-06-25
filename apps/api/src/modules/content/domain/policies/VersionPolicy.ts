/**
 * VersionPolicy defines when a new snapshot should be created.
 * It is intentionally decoupled from persistence — it answers a domain question.
 */
export class VersionPolicy {
  public shouldCreateSnapshot(currentVersion: number, lastSnapshotVersion: number, threshold = 5): boolean {
    return currentVersion - lastSnapshotVersion >= threshold;
  }
}
