import { workflowApi } from './workflowApi';
import { BaseEntityService } from './baseEntityService';
import { Workshop } from 'src/domain/workshop/workshop.model';

const basePath = '/workshops';

class WorkshopService extends BaseEntityService<Workshop> {
  constructor() {
    super(Workshop);
  }

  async fetchById(id: string): Promise<Workshop> {
    const { data } = await workflowApi.get(`${basePath}/${id}`);
    return this.toEntity(data);
  }

  async save(workshop: Workshop): Promise<Workshop> {
    const payload = workshop.toApiDto();
    const hasId = Boolean(workshop.id);
    const url = hasId ? `${basePath}/${workshop.id}` : basePath;
    const method = hasId ? 'put' : 'post';
    const { data } = await workflowApi[method](url, payload);
    return this.toEntity(data);
  }
}

export const workshopService = new WorkshopService();
