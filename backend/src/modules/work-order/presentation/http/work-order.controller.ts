import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../../../../common/auth/current-user.decorator';
import { ErrorResponse } from '../../../../common/errors/error-response.dto';
import type { AccessTokenClaims } from '../../../users/infrastructure/security/jwt-access-token.service';
import { WorkOrderService } from '../../application/work-order.service';
import {
  CreateExtraExpenseRequest,
  CreateWorkOrderHistoryRequest,
  CreateWorkOrderRequest,
  ExtraExpenseResponse,
  UpdateExtraExpenseRequest,
  UpdateWorkOrderRequest,
  WorkOrderHistoryItemResponse,
  WorkOrderResponse,
} from './work-order.dto';

@ApiTags('work-orders')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ type: ErrorResponse })
@Controller('work-orders')
export class WorkOrderController {
  constructor(private readonly workOrderService: WorkOrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a work order' })
  @ApiCreatedResponse({ type: WorkOrderResponse })
  @ApiBadRequestResponse({ description: 'The request body is invalid.' })
  @ApiNotFoundResponse({ type: ErrorResponse })
  create(
    @CurrentUser() user: AccessTokenClaims,
    @Body() request: CreateWorkOrderRequest,
  ): Promise<WorkOrderResponse> {
    return this.workOrderService.create(user.companyId, user.sub, request);
  }

  @Post(':workOrderId/extra-expenses')
  @ApiOperation({ summary: 'Create an extra expense' })
  @ApiCreatedResponse({ type: ExtraExpenseResponse })
  @ApiBadRequestResponse({ description: 'The request body is invalid.' })
  @ApiNotFoundResponse({ type: ErrorResponse })
  createExtraExpense(
    @CurrentUser() user: AccessTokenClaims,
    @Param('workOrderId', new ParseUUIDPipe({ version: '7' }))
    workOrderId: string,
    @Body() request: CreateExtraExpenseRequest,
  ): Promise<ExtraExpenseResponse> {
    return this.workOrderService.createExtraExpense(
      user.companyId,
      workOrderId,
      request,
    );
  }

  @Post(':workOrderId/history')
  @ApiOperation({ summary: 'Create a work order history entry' })
  @ApiCreatedResponse({ type: WorkOrderHistoryItemResponse })
  @ApiBadRequestResponse({ description: 'The request body is invalid.' })
  @ApiNotFoundResponse({ type: ErrorResponse })
  createHistory(
    @CurrentUser() user: AccessTokenClaims,
    @Param('workOrderId', new ParseUUIDPipe({ version: '7' }))
    workOrderId: string,
    @Body() request: CreateWorkOrderHistoryRequest,
  ): Promise<WorkOrderHistoryItemResponse> {
    return this.workOrderService.createHistory(
      user.companyId,
      workOrderId,
      user.sub,
      request,
    );
  }

  @Get()
  @ApiOperation({ summary: 'List work orders' })
  @ApiOkResponse({ type: WorkOrderResponse, isArray: true })
  @ApiNotFoundResponse({ type: ErrorResponse })
  findAll(
    @CurrentUser() user: AccessTokenClaims,
    @Query('customerId', new ParseUUIDPipe({ version: '7', optional: true }))
    customerId?: string,
  ): Promise<WorkOrderResponse[]> {
    return this.workOrderService.findAll(user.companyId, customerId);
  }

  @Get(':workOrderId')
  @ApiOperation({ summary: 'Get a work order' })
  @ApiOkResponse({ type: WorkOrderResponse })
  @ApiNotFoundResponse({ type: ErrorResponse })
  findById(
    @CurrentUser() user: AccessTokenClaims,
    @Param('workOrderId', new ParseUUIDPipe({ version: '7' }))
    workOrderId: string,
  ): Promise<WorkOrderResponse> {
    return this.workOrderService.findById(user.companyId, workOrderId);
  }

  @Get(':workOrderId/extra-expenses')
  @ApiOperation({ summary: 'List extra expenses' })
  @ApiOkResponse({ type: ExtraExpenseResponse, isArray: true })
  @ApiNotFoundResponse({ type: ErrorResponse })
  findAllExtraExpenses(
    @CurrentUser() user: AccessTokenClaims,
    @Param('workOrderId', new ParseUUIDPipe({ version: '7' }))
    workOrderId: string,
  ): Promise<ExtraExpenseResponse[]> {
    return this.workOrderService.findAllExtraExpenses(
      user.companyId,
      workOrderId,
    );
  }

  @Get(':workOrderId/extra-expenses/:extraExpenseId')
  @ApiOperation({ summary: 'Get an extra expense' })
  @ApiOkResponse({ type: ExtraExpenseResponse })
  @ApiNotFoundResponse({ type: ErrorResponse })
  findExtraExpenseById(
    @CurrentUser() user: AccessTokenClaims,
    @Param('workOrderId', new ParseUUIDPipe({ version: '7' }))
    workOrderId: string,
    @Param('extraExpenseId', new ParseUUIDPipe({ version: '7' }))
    extraExpenseId: string,
  ): Promise<ExtraExpenseResponse> {
    return this.workOrderService.findExtraExpenseById(
      user.companyId,
      workOrderId,
      extraExpenseId,
    );
  }

  @Get(':workOrderId/history')
  @ApiOperation({ summary: 'List work order history' })
  @ApiOkResponse({ type: WorkOrderHistoryItemResponse, isArray: true })
  @ApiNotFoundResponse({ type: ErrorResponse })
  findAllHistory(
    @CurrentUser() user: AccessTokenClaims,
    @Param('workOrderId', new ParseUUIDPipe({ version: '7' }))
    workOrderId: string,
  ): Promise<WorkOrderHistoryItemResponse[]> {
    return this.workOrderService.findAllHistory(user.companyId, workOrderId);
  }

  @Patch(':workOrderId')
  @ApiOperation({ summary: 'Update a work order' })
  @ApiOkResponse({ type: WorkOrderResponse })
  @ApiBadRequestResponse({ description: 'The request body is invalid.' })
  @ApiNotFoundResponse({ type: ErrorResponse })
  update(
    @CurrentUser() user: AccessTokenClaims,
    @Param('workOrderId', new ParseUUIDPipe({ version: '7' }))
    workOrderId: string,
    @Body() request: UpdateWorkOrderRequest,
  ): Promise<WorkOrderResponse> {
    return this.workOrderService.update(
      user.companyId,
      workOrderId,
      request,
    );
  }

  @Patch(':workOrderId/extra-expenses/:extraExpenseId')
  @ApiOperation({ summary: 'Update an extra expense' })
  @ApiOkResponse({ type: ExtraExpenseResponse })
  @ApiBadRequestResponse({ description: 'The request body is invalid.' })
  @ApiNotFoundResponse({ type: ErrorResponse })
  updateExtraExpense(
    @CurrentUser() user: AccessTokenClaims,
    @Param('workOrderId', new ParseUUIDPipe({ version: '7' }))
    workOrderId: string,
    @Param('extraExpenseId', new ParseUUIDPipe({ version: '7' }))
    extraExpenseId: string,
    @Body() request: UpdateExtraExpenseRequest,
  ): Promise<ExtraExpenseResponse> {
    return this.workOrderService.updateExtraExpense(
      user.companyId,
      workOrderId,
      extraExpenseId,
      request,
    );
  }

  @Delete(':workOrderId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a work order' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ type: ErrorResponse })
  async delete(
    @CurrentUser() user: AccessTokenClaims,
    @Param('workOrderId', new ParseUUIDPipe({ version: '7' }))
    workOrderId: string,
  ): Promise<void> {
    await this.workOrderService.delete(user.companyId, workOrderId);
  }

  @Delete(':workOrderId/extra-expenses/:extraExpenseId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete an extra expense' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ type: ErrorResponse })
  async deleteExtraExpense(
    @CurrentUser() user: AccessTokenClaims,
    @Param('workOrderId', new ParseUUIDPipe({ version: '7' }))
    workOrderId: string,
    @Param('extraExpenseId', new ParseUUIDPipe({ version: '7' }))
    extraExpenseId: string,
  ): Promise<void> {
    await this.workOrderService.deleteExtraExpense(
      user.companyId,
      workOrderId,
      extraExpenseId,
    );
  }
}
