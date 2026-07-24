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
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
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
  ListCustomersQuery,
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
  @ApiCreatedResponse({ type: CustomerResponse })
  create(
    @CurrentUser() user: AccessTokenClaims,
    @Body() request: CreateCustomerRequest,
  ): Promise<CustomerResponse> {
    return this.createCustomerService.create(user.companyId, request);
  }

  @Post(':customerId/contact')
  @ApiCreatedResponse({ type: ContactResponse })
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
  @ApiOkResponse({ type: CustomerResponse, isArray: true })
  findAll(
    @CurrentUser() user: AccessTokenClaims,
    @Query() query: ListCustomersQuery,
  ): Promise<CustomerResponse[]> {
    return this.customerService.findAll(user.companyId, query.populate ?? []);
  }

  @Get(':customerId')
  @ApiOkResponse({ type: CustomerResponse })
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
  @ApiOkResponse({ type: CustomerResponse })
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
  @ApiOkResponse({ type: ContactResponse })
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
