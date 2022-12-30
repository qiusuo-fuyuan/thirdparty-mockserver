import { Job } from "./Job.js"

export class JobSearchPagingResult {
    pageSize: number
    pageNumber: number
    totalCount: number
    jobs: Array<Job>
}
