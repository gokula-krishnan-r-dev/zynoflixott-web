"use client";
import React, { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "../ui/textarea";
import axios from "@/lib/axios";
import MultiSelect from "@/components/ui/multi-select";
import { formdata } from "@/constants/service-provider-form-data";
import { userId } from "@/lib/user";
import { useRouter } from "next/navigation";
const getAudioVideoDuration = async (file: File) => {
  return new Promise((resolve, reject) => {
    const media = document.createElement("video");
    media.onloadedmetadata = () => {
      resolve(media.duration);
    };
    media.src = URL.createObjectURL(file);
  });
};
const dynamicFormSchema = z.object(
  formdata.reduce((acc: any, field: any) => {
    if (field.tag === "date") {
      acc[field.name] = field.required
        ? z.date({
            required_error: "A date of birth is required.",
          })
        : z.any();
    } else if (field.tag === "tags") {
      acc[field.name] = field.required
        ? z.string().min(2, {
            message: `${field.title} must be at least 2 characters.`,
          })
        : z.string();
    } else if (field.tag === "file") {
      acc[field.name] = field.required ? z.any() : z.any();
    } else if (field.tag === "checkbox") {
      acc[field.name] = field.required
        ? z.boolean().refine((val) => val === true, {
            message: `${field.title} is required.`,
          })
        : z.boolean();
    } else if (field.tag === "select") {
      acc[field.name] = field.required
        ? z.array(z.string()).nonempty({
            message: `${field.title} is required.`,
          })
        : z.any();
    } else if (field.tag === "select-1") {
      acc[field.name] = field.required
        ? z.array(z.string()).nonempty({
            message: `${field.title} is required.`,
          })
        : z.any();
    } else if (field.tag === "number") {
      acc[field.name] = field.required
        ? z.number().min(1, {
            message: `${field.title} must be at least 1.`,
          })
        : z.number();
    } else {
      // Handle text and other input types as strings
      acc[field.name] = field.required
        ? z.string().min(2, {
            message: `${field.title} must be at least 2 characters.`,
          })
        : z.string();
    }
    return acc;
  }, {} as Record<string, z.ZodTypeAny>)
);

const formDesign =
  "w-full bg-body rounded-2xl outline-none px-4 py-6 text-base";
const formLabelClassName = "text-xl font-bold";

const CreateFormSubmit = ({ status, openPayModal, isSuccessful }: any) => {
  console.log(isSuccessful, "isSuccessful");
  const router = useRouter();
  const [thumbnail, setThumbnail] = useState<any>("");
  const [previewVideo, setPreviewVideo] = useState<any>("");
  const [originalVideo, setOriginalVideo] = useState<any>("");
  const [totallDuration, setTotallDuration] = useState<any>("");

  const [isLoading, setIsLoading] = useState(false);
  const [progressEvent, setProgressEvent] = useState(0);
  const form = useForm<z.infer<typeof dynamicFormSchema>>({
    resolver: zodResolver(dynamicFormSchema),
    defaultValues: Object.fromEntries(
      formdata.map((field: any) => [field.name, ""])
    ),
  });

  async function onSubmit(values: z.infer<typeof dynamicFormSchema>) {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("category", values.category);
      formData.append("language", values.language);
      formData.append("duration", totallDuration);

      // thumbnail
      formData.append("thumbnail", thumbnail as File);
      // preview video
      formData.append("preview_video", previewVideo as File);
      formData.append("certification", values.certification);
      formData.append("orginal_video", originalVideo as File);
      formData.append("is_banner_video", "true");
      formData.append("created_by_id", userId || "");
      formData.append("user", userId || "");
      formData.append("created_by_name", "admin");
      const response1 = await axios.post(`/create_videos`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent: any) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgressEvent(percentCompleted);
          // setIsLoading(percentCompleted < 100);
        },
      });

      if (response1.status === 201) {
        toast.success("Banner video added successfully");
        setIsLoading(false);
        router.push("/");
        // const transaction = localStorage.getItem("transactionId");
        // const response1 = await axios.put(`/payment/video/${transaction}`, {
        //   status: "success",
        //   isVideo_uploaded: true,
        // });

        console.log(response1);
      } else {
        toast.error("Banner video added failed please try again");
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center justify-center">
          <p className="text-3xl font-semibold">Uploading...</p>
          <div className="relative pt-1 w-80">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                  {progressEvent}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
              <div
                style={{ width: `${progressEvent}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="px-8 py-4">
        <h1 className="py-2 text-2xl font-semibold">Add Banner Video </h1>

        <div className="px-2 pb-24 pt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {formdata?.map((item: any, index: any) => (
                <div key={index} className="">
                  {item.tag === "text" ? (
                    <FormField
                      key={item.name}
                      control={form.control}
                      name={item.name}
                      render={({ field }: any) => (
                        <FormItem>
                          <FormLabel className={formLabelClassName}>
                            {item.title} {item.required && "*"}
                          </FormLabel>

                          <FormControl>
                            <Input
                              maxLength={item.maxlength}
                              className={formDesign}
                              placeholder={`Enter ${item.title}`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : item.tag === "number" ? (
                    <FormField
                      key={item.name}
                      control={form.control}
                      name={item.name}
                      render={({ field }: any) => (
                        <FormItem>
                          <FormLabel>{item.title}</FormLabel>

                          <FormControl>
                            <Input
                              className="w-full"
                              type="number"
                              onChange={(e) => {
                                field.onChange(+e.target.value as number);
                              }}
                              placeholder={`Enter ${item.title}`}
                              // {...field}
                              value={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : item.tag === "checkbox" ? (
                    <FormField
                      key={item.name}
                      control={form.control}
                      name={item.name}
                      render={({ field }: any) => (
                        <FormItem>
                          <FormLabel>{item.title}</FormLabel>

                          <FormControl>
                            <Input
                              className="h-4 w-4"
                              type="checkbox"
                              placeholder={`Enter ${item.title}`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : item.tag === "file" ? (
                    <FormField
                      key={item.name}
                      control={form.control}
                      name={item.name}
                      render={({ field }: any) => (
                        <FormItem>
                          <FormLabel>{item.title}</FormLabel>

                          <FormControl>
                            <label
                              htmlFor="file-upload"
                              className="mt-2 flex justify-center rounded-3xl border border-dashed border-gray-400 px-6 py-24"
                            >
                              <div className="text-center">
                                <svg
                                  className="mx-auto h-12 w-12 text-gray-300"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                                    clip-rule="evenodd"
                                  ></path>
                                </svg>
                                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                  <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                  >
                                    <span>Upload a file</span>
                                    <Input
                                      className=""
                                      onChange={async (e: any) => {
                                        console.log(
                                          "working",
                                          e.target.files[0]
                                        );
                                        const MAX_FILE_SIZE = 1000000000; // 1GB
                                        const source = e.target.files[0];
                                        const fileSize = source.size;
                                        const fileType = source.type;

                                        // Check file size
                                        if (fileSize > MAX_FILE_SIZE) {
                                          toast.error(
                                            "File size exceeds 1GB limit"
                                          );
                                          return;
                                        }

                                        // Check file type
                                        const validImageTypes = [
                                          "image/jpeg",
                                          "image/png",
                                          "image/gif",
                                        ];
                                        const validVideoTypes = [
                                          "video/mp4",
                                          "video/mpeg",
                                          "video/quicktime",
                                        ];

                                        if (
                                          !validImageTypes.includes(fileType) &&
                                          !validVideoTypes.includes(fileType)
                                        ) {
                                          toast.error(
                                            "Invalid file type. Please upload an image or video."
                                          );
                                          return;
                                        }

                                        function convertHMS(props: {
                                          value: string;
                                        }) {
                                          const { value } = props;
                                          const sec = parseInt(value, 10); // convert value to number if it's string
                                          let hours = `${Math.floor(
                                            sec / 3600
                                          )}`; // get hours
                                          let minutes = `${Math.floor(
                                            (sec - +hours * 3600) / 60
                                          )}`; // get minutes
                                          let seconds = `${
                                            sec - +hours * 3600 - +minutes * 60
                                          }`; //  get seconds
                                          // add 0 if value < 10; Example: 2 => 02
                                          if (+hours < 10) {
                                            hours = "0" + hours;
                                          }
                                          if (+minutes < 10) {
                                            minutes = "0" + minutes;
                                          }
                                          if (+seconds < 10) {
                                            seconds = "0" + seconds;
                                          }
                                          return (
                                            hours +
                                            ":" +
                                            minutes +
                                            ":" +
                                            seconds
                                          ); // Return is HH : MM : SS
                                        }
                                        const file = e.target.files[0];

                                        if (item.name === "thumbnail") {
                                          setThumbnail(e.target.files[0]);
                                        }
                                        if (item.name === "original_video") {
                                          setOriginalVideo(e.target.files[0]);
                                        }

                                        if (item.name === "preview_video") {
                                          setPreviewVideo(e.target.files[0]);
                                        }

                                        if (item.name === "original_video") {
                                          new Promise(
                                            async (resolve, reject) => {
                                              let reader = new FileReader();
                                              reader.onload = function () {
                                                if (!reader.result) return;
                                                let aud = new Audio(
                                                  reader.result as string
                                                );
                                                aud.onloadedmetadata =
                                                  function () {
                                                    resolve(
                                                      convertHMS({
                                                        value: `${aud.duration}`,
                                                      })
                                                    );
                                                  };
                                              };

                                              const durationVideo: any =
                                                getAudioVideoDuration(file);
                                              durationVideo
                                                .then(function (value: any) {
                                                  setTotallDuration(value);
                                                  console.log(
                                                    "duration",
                                                    value
                                                  );
                                                })
                                                .catch(function (error: any) {
                                                  console.error(
                                                    "Error:",
                                                    error
                                                  );
                                                });

                                              reader.readAsDataURL(file);
                                            }
                                          ).then((d) => {
                                            return true;
                                          });
                                        }
                                      }}
                                      type="file"
                                      placeholder={`Enter ${item.title}`}
                                    />
                                  </label>
                                </div>
                                <p className="pl-1 text-sm leading-6 text-gray-600">
                                  or drag and drop
                                </p>
                                <p className="text-xs leading-5 text-gray-600">
                                  PNG, JPG up to 10GB
                                </p>
                                {item.name === "thumbnail" && thumbnail && (
                                  <div className="">
                                    <img
                                      src={URL.createObjectURL(thumbnail)}
                                      alt=""
                                      width={800}
                                      height={300}
                                      className="rounded-3xl border object-cover"
                                    />
                                    <p className="text-xs leading-5 text-gray-600">
                                      {thumbnail?.name}
                                    </p>
                                  </div>
                                )}
                                {item.name === "preview_video" &&
                                  previewVideo && (
                                    <div className="">
                                      <video
                                        autoPlay
                                        loop
                                        muted
                                        width="800"
                                        height="300"
                                        controls
                                        src={URL.createObjectURL(previewVideo)}
                                      >
                                        Your browser does not support the video
                                        tag.
                                      </video>

                                      <p className="text-xs leading-5 text-gray-600">
                                        {previewVideo?.name}
                                      </p>
                                    </div>
                                  )}
                              </div>
                            </label>
                          </FormControl>
                          {field.value && (
                            <img
                              src={field.value}
                              className="mt-6 h-[300px] w-[400px] rounded-3xl border object-cover shadow-lg"
                              alt=""
                            />
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : item.tag === "textarea" ? (
                    <FormField
                      key={item.name}
                      control={form.control}
                      name={item.name}
                      render={({ field }: any) => (
                        <FormItem>
                          <FormLabel className={formLabelClassName}>
                            {item.title}
                          </FormLabel>

                          <FormControl>
                            <Textarea
                              rows={6}
                              className={formDesign}
                              placeholder={`Enter ${item.title}`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : item.tag === "select" ? (
                    <FormField
                      control={form.control}
                      name={item.name}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{item.title}</FormLabel>

                          <MultiSelect
                            status={status}
                            field={field}
                            name={item.name}
                            options={item.options}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : item.tag === "select-1" ? (
                    <FormField
                      control={form.control}
                      name={item.name}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={formLabelClassName}>
                            {item.title}
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className={formDesign}>
                                <SelectValue placeholder={item.placeholder} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <ScrollArea className="min-h-60">
                                {item.options.map((option: any) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      key={item.name}
                      control={form.control}
                      name={item.name}
                      render={({ field }: any) => (
                        <FormItem>
                          <FormLabel className={formLabelClassName}>
                            {item.title}
                          </FormLabel>

                          <FormControl>
                            <Textarea
                              rows={6}
                              className="w-full"
                              placeholder={`Enter ${item.title}`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              ))}

              {isSuccessful && (
                <div className="">
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Corrupti laborum assumenda maxime adipisci, cum commodi
                    illum dicta obcaecati ea, facilis mollitia, perspiciatis ab
                    repellat ad pariatur doloremque maiores saepe veniam.
                  </p>
                  {/* price 499 per video upload */}
                  <p className="text-lg font-semibold">
                    Price: 499 per video upload
                  </p>
                </div>
              )}
              <div className="flex items-end justify-end">
                {isSuccessful ? (
                  <div
                    onClick={openPayModal}
                    className="px-6 py-3 rounded-3xl cursor-pointer border text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Payment
                  </div>
                ) : (
                  <Button
                    className="px-6 py-3 rounded-3xl border text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
                    type="submit"
                  >
                    Upload
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateFormSubmit;
