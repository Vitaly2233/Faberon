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
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
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
import { ContactService } from '../../application/contact.service';
import { CreateCustomerService } from '../../application/create-customer.service';
import { CustomerService } from '../../application/customer.service';
import { CustomerNotFoundError } from '../../domain/customer.errors';
import {
  ContactResponse,
  CreateContactRequest,
  UpdateContactRequest,
} from './contact.dto';
import {
  CreateCustomerRequest,
  CustomerResponse,
  UpdateCustomerRequest,
} from './customer.dto';

@ApiTags('customers')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ type: ErrorResponse })
@Controller('customers')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly createCustomerService: CreateCustomerService,
    private readonly contactService: ContactService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a customer' })
  @ApiCreatedResponse({ type: CustomerResponse })
  @ApiBadRequestResponse({ description: 'The request body is invalid.' })
  create(
    @CurrentUser() user: AccessTokenClaims,
    @Body() request: CreateCustomerRequest,
  ): Promise<CustomerResponse> {
    return this.createCustomerService.create(user.companyId, request);
  }

  @Post(':customerId/contact')
  @ApiOperation({ summary: 'Create contact' })
  @ApiCreatedResponse({ type: ContactResponse })
  @ApiBadRequestResponse({ description: 'The request or customer ID is invalid.' })
  @ApiNotFoundResponse({ type: ErrorResponse })
  @ApiConflictResponse({ type: ErrorResponse })
  createContact(
    @CurrentUser() user: AccessTokenClaims,
    @Param('customerId', new ParseUUIDPipe({ version: '7' }))
    customerId: string,
    @Body() request: CreateContactRequest,
  ): Promise<ContactResponse> {
    return this.contactService.create(user.companyId, customerId, request);
  }

  @Get()
  @ApiOperation({ summary: 'List customers' })
  @ApiOkResponse({ type: CustomerResponse, isArray: true })
  findAll(
    @CurrentUser() user: AccessTokenClaims,
  ): Promise<CustomerResponse[]> {
    return this.customerService.findAll(user.companyId);
  }

  @Get(':customerId')
  @ApiOperation({ summary: 'Get a customer' })
  @ApiOkResponse({ type: CustomerResponse })
  @ApiBadRequestResponse({ description: 'The customer ID is not a UUIDv7.' })
  @ApiNotFoundResponse({ type: ErrorResponse })
  async findById(
    @CurrentUser() user: AccessTokenClaims,
    @Param('customerId', new ParseUUIDPipe({ version: '7' }))
    customerId: string,
  ): Promise<CustomerResponse> {
    const customer = await this.customerService.findById(
      user.companyId,
      customerId,
    );
    if (!customer) throw new CustomerNotFoundError(customerId);
    return customer;
  }

  @Get(':customerId/contact')
  @ApiOperation({ summary: 'Get contact' })
  @ApiOkResponse({ type: ContactResponse })
  @ApiNotFoundResponse({ type: ErrorResponse })
  findContact(
    @CurrentUser() user: AccessTokenClaims,
    @Param('customerId', new ParseUUIDPipe({ version: '7' }))
    customerId: string,
  ): Promise<ContactResponse> {
    return this.contactService.find(user.companyId, customerId);
  }

  @Patch(':customerId')
  @ApiOperation({ summary: 'Update a customer' })
  @ApiOkResponse({ type: CustomerResponse })
  @ApiBadRequestResponse({ description: 'The request body is invalid.' })
  @ApiNotFoundResponse({ type: ErrorResponse })
  update(
    @CurrentUser() user: AccessTokenClaims,
    @Param('customerId', new ParseUUIDPipe({ version: '7' }))
    customerId: string,
    @Body() request: UpdateCustomerRequest,
  ): Promise<CustomerResponse> {
    return this.customerService.update(user.companyId, customerId, request);
  }

  @Patch(':customerId/contact')
  @ApiOperation({ summary: 'Update contact' })
  @ApiOkResponse({ type: ContactResponse })
  @ApiBadRequestResponse({ description: 'The request body is invalid.' })
  @ApiNotFoundResponse({ type: ErrorResponse })
  updateContact(
    @CurrentUser() user: AccessTokenClaims,
    @Param('customerId', new ParseUUIDPipe({ version: '7' }))
    customerId: string,
    @Body() request: UpdateContactRequest,
  ): Promise<ContactResponse> {
    return this.contactService.update(user.companyId, customerId, request);
  }

  @Delete(':customerId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a customer' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ type: ErrorResponse })
  async delete(
    @CurrentUser() user: AccessTokenClaims,
    @Param('customerId', new ParseUUIDPipe({ version: '7' }))
    customerId: string,
  ): Promise<void> {
    await this.customerService.delete(user.companyId, customerId);
  }

  @Delete(':customerId/contact')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete contact' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ type: ErrorResponse })
  async deleteContact(
    @CurrentUser() user: AccessTokenClaims,
    @Param('customerId', new ParseUUIDPipe({ version: '7' }))
    customerId: string,
  ): Promise<void> {
    await this.contactService.delete(user.companyId, customerId);
  }
}
