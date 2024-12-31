import * as Dialog from "@radix-ui/react-dialog";
import React from "react";
import CloseIcon from "./icon-close.svg";
import { useState } from "react";
import { EntitlementBars } from "~/app/route-index/entitlement-bars";
import { SubmitHandler, useForm } from "react-hook-form";
import * as Toast from "@radix-ui/react-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/route-index/wrapper-components/radix-select-wrapper";
import { Input } from "~/app/route-index/wrapper-components/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/route-index/wrapper-components/form-wrapper";
import { trpc } from "~/utils/trpc";

type Props = {
  trigger: React.ReactNode;
};

type Inputs = {
  startDate: string;
  endDate: string;
  leavePolicyId: string;
};

export default function ApplyDialog(props: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);

  const { data: leavePolicies } = trpc.leavePolicies.getLeavePolicies.useQuery();

  const form = useForm<Inputs>({
    defaultValues: {
      startDate: "",
      endDate: "",
      leavePolicyId: undefined,
    },
  });

  const { mutate, isLoading: isSaving, error, isSuccess } = trpc.leaveRequests.createLeaveRequest.useMutation();

  const trpcContext = trpc.useContext();

  const onSubmit: SubmitHandler<Inputs> = (values) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsToastOpen(false);

    mutate(
      {
        ...values,
        leavePolicyId: +values.leavePolicyId,
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          trpcContext.employees.invalidate();
          form.reset();
        },
        onSettled: () => {
          setIsToastOpen(true);
        },
      }
    );
  };

  if (!leavePolicies) {
    return null;
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>{props.trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gray-light data-[state=open]:animate-overlayShow" />

        <Dialog.Content className="fixed left-[50%] top-[50%] h-auto max-h-[85vh] w-[36rem] translate-x-[-50%] translate-y-[-50%] overflow-auto rounded-xl bg-white p-6 focus:outline-none data-[state=open]:animate-contentShow">
          <header className="flex h-14 items-center">
            <Dialog.Title className="flex-1 text-xl font-bold text-black-dark">Apply for a Request</Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="rounded p-3 outline-gray-light hover:bg-gray-light active:opacity-75"
                aria-label="Close"
              >
                <div
                  className="h-[18px] w-[18px]  bg-contain bg-no-repeat transition-colors duration-300"
                  style={{
                    backgroundImage: `url(${CloseIcon})`,
                  }}
                ></div>
              </button>
            </Dialog.Close>
          </header>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-7 pt-6">
                <div className="h-56 rounded-3xl bg-gray-light px-5 py-6">
                  <h1 className="text-xs uppercase text-gray-text">Your Entitlement</h1>
                  <EntitlementBars display="compact" />
                </div>
                <fieldset className="flex flex-col justify-between gap-2">
                  <FormField
                    control={form.control}
                    name="startDate"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mb-1 block text-xs uppercase text-black-dark" htmlFor="startDate">
                          Start Date
                        </FormLabel>
                        <FormControl className="box-border h-9 w-full rounded bg-gray-light p-2 text-sm text-black-input">
                          <Input type="date" {...field} data-testid="apply-for-leave-start-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mb-1 block text-xs uppercase text-black-dark" htmlFor="endDate">
                          Stop Date
                        </FormLabel>
                        <FormControl className="box-border h-9 w-full rounded bg-gray-light p-2 text-sm text-black-input">
                          <Input type="date" {...field} data-testid="apply-for-leave-end-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="leavePolicyId"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel
                          className="mb-1 block text-left text-xs uppercase text-black-dark"
                          htmlFor="request-type"
                        >
                          Request Type
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger
                              className="box-border flex h-9 w-full items-center justify-between rounded border-0 bg-gray-light p-2 text-left text-sm text-black-input"
                              data-testid="apply-for-leave-type"
                            >
                              <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="relative z-50 w-full overflow-hidden border-0 bg-gray-light">
                            {leavePolicies.map((leavePolicy) => (
                              <SelectItem
                                key={leavePolicy.id}
                                value={`${leavePolicy.id}`}
                                data-testid={"apply-for-leave-type-" + leavePolicy.id}
                              >
                                {leavePolicy.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </fieldset>
              </div>
              <div className="mt-12 grid grid-cols-2 gap-7">
                <Dialog.Close asChild>
                  <button
                    className="rounded-md bg-gray-light p-2 text-sm font-bold text-gray-text hover:bg-gray-light-2 hover:text-white focus:ring-2 focus:ring-blue active:opacity-60 active:transition-none"
                    type="button"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  className="rounded-md border border-solid border-blue p-2 text-sm font-bold text-gray-text hover:bg-blue hover:text-white focus:ring-2 focus:ring-blue active:opacity-60 active:transition-none disabled:pointer-events-none disabled:opacity-10"
                  type="submit"
                  disabled={isSaving}
                  data-testid="apply-for-leave-apply-button"
                >
                  Apply
                </button>
              </div>
            </form>
          </Form>
        </Dialog.Content>
      </Dialog.Portal>
      <Toast.Root
        duration={5000}
        className="grid grid-cols-[auto_max-content] items-center gap-x-[15px] rounded-md bg-white p-[15px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] [grid-template-areas:_'title_action'_'description_action'] data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut data-[swipe=cancel]:transition-[transform_200ms_ease-out]"
        open={isToastOpen}
        onOpenChange={setIsToastOpen}
      >
        {error && (
          <>
            <Toast.Title className="mb-[5px] text-[15px] font-medium text-red [grid-area:_title]">
              Failed to submit leave request
            </Toast.Title>
            <Toast.Description
              className="m-0 text-[13px] leading-[1.3] text-slate-500 [grid-area:_description]"
              data-testid="apply-for-leave-error"
            >
              {error.message || "Something went wrong. Please try again."}
            </Toast.Description>
          </>
        )}
        {isSuccess && (
          <>
            <Toast.Title className="mb-[5px] text-[15px] font-medium text-green [grid-area:_title]">
              Successfully submitted leave request
            </Toast.Title>
          </>
        )}
      </Toast.Root>
    </Dialog.Root>
  );
}
