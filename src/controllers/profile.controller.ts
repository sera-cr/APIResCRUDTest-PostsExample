import { FastifyReply, FastifyRequest } from "fastify";
import { CreateProfileInput, EditProfileInput, IdParams } from "../schemas/profile.schema.js";
import { createProfile, deleteProfile, getProfileUserId, updateProfile } from "../services/profile.service.js";
import pkg from "@prisma/client";
const { Role } = pkg;

export async function getProfileHandler(
  request: FastifyRequest<{
    Params: IdParams
  }>,
  reply: FastifyReply
) {
  const userId: number = parseInt(request.params.userId);

  // get profile by user id
  const profile = await getProfileUserId(userId);

  try {
    if (!profile) {
      return reply.code(401).send({
        message: "Invalid user id"
      });
    }

    return reply.code(200).send(profile);
  } catch(err) {
    console.error(err);

    return reply.code(500);
  }
}

export async function createProfileHandler(
  request: FastifyRequest<{
    Params: IdParams
    Body: CreateProfileInput
  }>,
  reply: FastifyReply
) {
  const body = request.body;
  const userId = parseInt(request.params.userId);

  try {
    if (request.user.id === userId || request.user.role === Role.Admin) {
      const profile = await createProfile(body.bio, userId);

      return reply.code(200).send(profile);
    }
  } catch(err) {
    console.error(err);

    return reply.code(500);
  }
}

export async function editProfileHandler(
  request: FastifyRequest<{
    Params: IdParams
    Body: EditProfileInput
  }>,
  reply: FastifyReply
) {
  const userId = parseInt(request.params.userId);
  const body = request.body;

  // get profile by user id
  const profile = await getProfileUserId(userId);

  if (!profile) {
    return reply.code(401).send({
      message: "Invalid user id"
    });
  }

  try {
    const profile = await updateProfile(body.bio, userId);

    return reply.code(200).send(profile);
  } catch(err) {
    console.error(err);

    return reply.code(500);
  }
}

export async function deleteProfileHandler(
  request: FastifyRequest<{
    Params: IdParams
  }>,
  reply: FastifyReply
) {
  const userId = parseInt(request.params.userId);

  // get profile by user id
  const profile = await getProfileUserId(userId);

  if (!profile) {
    return reply.code(401).send({
      message: "Invalid user id"
    });
  }

  try {
    const profile = await deleteProfile(userId);

    return reply.code(200).send(profile);
  } catch(err) {
    console.error(err);

    return reply.code(500);
  }
}